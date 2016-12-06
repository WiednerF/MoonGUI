--- This script implements a simple QoS test by generating two flows and measuring their latencies.
local mg = require "moongen"
local memory = require "memory"
local device = require "device"
local ts = require "timestamping"
local filter = require "filter"
local stats = require "stats"
local hist = require "histogram"
local timer = require "timer"
local log = require "log"

--****ADDED FOR MoonGui (Obligatory)
local pipe = require "pipe"
local socket = require "socket"
local moongui = require "moongui"

-- check out l3-load-latency.lua if you want to get this via ARP
local ETH_DST = "10:11:12:13:14:15" -- src mac is taken from the NIC
local IP_SRC = "192.168.0.1"
local NUM_FLOWS = 256 -- src ip will be IP_SRC + random(0, NUM_FLOWS - 1)
local IP_DST = "10.0.0.1"
local PORT_SRC = 1234

function configure(parser)
    parser:description("Generates two flows of traffic and compares them. This example requires an ixgbe NIC due to the used hardware features.")
    parser:argument("execution", "The number of the current execution"):convert(tonumber)
    --TODO Add Arguments PKT_SIZE
end

function master(args)
    --****ADDED FOR MoonGui
    local config = moongui.getConfig(args.execution)
    local p = pipe:newSlowPipe()

    -- 3 tx queues: traffic, background traffic, and timestamped packets
    -- 2 rx queues: traffic and timestamped packets
    local txDev, rxDev
    -- these two cases could actually be merged as re-configurations of ports are ignored
    -- the dual-port case could just config the 'first' device with 2/3 queues
    -- however, this example scripts shows the explicit configuration instead of implicit magic
    if config.interfaces.tx == config.interfaces.rx then
        -- sending and receiving from the same port
        txDev = device.config { port = config.interfaces.tx, rxQueues = 2, txQueues = 3 }
        rxDev = txDev
    else
        -- two different ports, different configuration
        txDev = device.config { port = config.interfaces.tx, rxQueues = 1, txQueues = 3 }
        rxDev = device.config { port = config.interfaces.rx, rxQueues = 2 }
    end
    -- wait until the links are up
    device.waitForLinks()
    log:info("Sending %d MBit/s background traffic to UDP port %d", config.input.bgRate, config.input.bgPort)
    log:info("Sending %d MBit/s foreground traffic to UDP port %d", config.input.fgRate, config.input.fgPort)
    -- setup rate limiters for CBR traffic
    -- see l2-poisson.lua for an example with different traffic patterns
    txDev:getTxQueue(0):setRate(config.input.bgRate)
    txDev:getTxQueue(1):setRate(config.input.fgRate)
    -- background traffic
    if config.input.bgRate > 0 then
        mg.startTask("loadSlave", txDev:getTxQueue(0), config.input.bgPort, config)
    end
    -- high priority traffic (different UDP port)
    if config.input.fgRate > 0 then
        mg.startTask("loadSlave", txDev:getTxQueue(1), config.input.fgPort, config)
    end
    -- count the incoming packets
    mg.startTask("counterSlave", rxDev:getRxQueue(0))
    -- measure latency from a second queue
    mg.startSharedTask("timerSlave", txDev:getTxQueue(2), rxDev:getRxQueue(1), config.input.bgPort, config.input.fgPort, config.input.fgRate / (config.input.fgRate + config.input.bgRate),config,p)
    -- wait until all tasks are finished
    moongui.server(p,mg)
    mg.waitForTasks()
end

function server(p)
    moongui.server(p, mg)
end

--TODO Add SlowPipe and Messages for rate

function loadSlave(queue, port, config)
    mg.sleepMillis(100) -- wait a few milliseconds to ensure that the rx thread is running
    -- TODO: implement barriers
    local mem = memory.createMemPool(function(buf)
        buf:getUdpPacket():fill {
            pktLength = config.input.size, -- this sets all length headers fields in all used protocols
            ethSrc = queue, -- get the src mac from the device
            ethDst = ETH_DST,
            -- ipSrc will be set later as it varies
            ip4Dst = IP_DST,
            udpSrc = PORT_SRC,
            udpDst = port,
            -- payload will be initialized to 0x00 as new memory pools are initially empty
        }
    end)
    -- TODO: fix per-queue stats counters to use the statistics registers here
    local txCtr = stats:newManualTxCounter("Port " .. port, "plain")
    local baseIP = parseIPAddress(IP_SRC)
    -- a buf array is essentially a very thing wrapper around a rte_mbuf*[], i.e. an array of pointers to packet buffers
    local bufs = mem:bufArray()
    while mg.running() do
        -- allocate buffers from the mem pool and store them in this array
        bufs:alloc(config.input.size)
        for _, buf in ipairs(bufs) do
            -- modify some fields here
            local pkt = buf:getUdpPacket()
            -- select a randomized source IP address
            -- you can also use a wrapping counter instead of random
            pkt.ip4.src:set(baseIP + math.random(NUM_FLOWS) - 1)
            -- you can modify other fields here (e.g. different source ports or destination addresses)
        end
        -- send packets
        bufs:offloadUdpChecksums()
        txCtr:updateWithSize(queue:send(bufs), config.input.size)

    end
    txCtr:finalize()
end

function counterSlave(queue)
    -- the simplest way to count packets is by receiving them all
    -- an alternative would be using flow director to filter packets by port and use the queue statistics
    -- however, the current implementation is limited to filtering timestamp packets
    -- (changing this wouldn't be too complicated, have a look at filter.lua if you want to implement this)
    -- however, queue statistics are also not yet implemented and the DPDK abstraction is somewhat annoying
    local bufs = memory.bufArray()
    local ctrs = {}
    while mg.running(100) do
        local rx = queue:recv(bufs)
        for i = 1, rx do
            local buf = bufs[i]
            local pkt = buf:getUdpPacket()
            local port = pkt.udp:getDstPort()
            local ctr = ctrs[port]
            if not ctr then
                ctr = stats:newPktRxCounter("Port " .. port, "plain")
                ctrs[port] = ctr
            end
            ctr:countPacket(buf)
        end
        -- update() on rxPktCounters must be called to print statistics periodically
        -- this is not done in countPacket() for performance reasons (needs to check timestamps)
        for k, v in pairs(ctrs) do
            v:update()
            local mpps,mbit = v:getStats()
            if config.input.fgPort==k then
                p:send({rateFG=mbit[#mbit],timer=socket.gettime()})
            else
                p:send({rateBG=mbit[#mbit],timer=socket.gettime()})
            end

        end
        bufs:freeAll()
    end
    for k, v in pairs(ctrs) do
        v:finalize()
    end
    -- TODO: check the queue's overflow counter to detect lost packets
end


function timerSlave(txQueue, rxQueue, bgPort, port, ratio, config,p)
    local txDev = txQueue.dev
    local rxDev = rxQueue.dev
    local timestamper = ts:newUdpTimestamper(txQueue, rxQueue)
    local histBg, histFg = hist(), hist()
    -- wait one second, otherwise we might start timestamping before the load is applied
    mg.sleepMillis(1000)
    local baseIP = parseIPAddress(IP_SRC)
    local rateLimit = timer:new(0.001)
    while mg.running() do
        local port = math.random() <= ratio and port or bgPort
        local lat = timestamper:measureLatency(config.input.size, function(buf)
            local pkt = buf:getUdpPacket()
            pkt:fill {
                pktLength = config.input.size, -- this sets all length headers fields in all used protocols
                ethSrc = txQueue, -- get the src mac from the device
                ethDst = ETH_DST,
                -- ipSrc will be set later as it varies
                ip4Dst = IP_DST,
                udpSrc = PORT_SRC,
                udpDst = port,
            }
            pkt.ip4.src:set(baseIP + math.random(NUM_FLOWS) - 1)
        end)
        if lat then
            if port == bgPort then
                histBg:update(lat)
                p:send({latencyBG=lat,timer=socket.gettime()})
            else
                histFg:update(lat)
                p:send({latencyFG=lat,timer=socket.gettime()})
            end
        end
        rateLimit:wait()
        rateLimit:reset()
    end
    mg.sleepMillis(100) -- to prevent overlapping stdout
    histBg:print("Background traffic")
    histFg:print("Foreground traffic")
end

