local mg     = require "moongen"
local memory = require "memory"
local device = require "device"
local ts     = require "timestamping"
local filter = require "filter"
local hist   = require "histogram"
local stats  = require "stats"
local timer  = require "timer"
local arp    = require "proto.arp"
local log    = require "log"

--****ADDED FOR MoonGui (Obligatory)
local pipe = require "pipe"
local socket = require "socket"
local moongui = require "moongui"

-- set addresses here
local DST_MAC		= nil -- resolved via ARP on GW_IP or DST_IP, can be overriden with a string here
local SRC_IP_BASE	= "10.0.0.10" -- actual address will be SRC_IP_BASE + random(0, flows)
local DST_IP		= "10.1.0.10"
local SRC_PORT		= 1234
local DST_PORT		= 319

-- answer ARP requests for this IP on the rx port
-- change this if benchmarking something like a NAT device
local RX_IP		= DST_IP
-- used to resolve DST_MAC
local GW_IP		= DST_IP
-- used as source IP to resolve GW_IP to DST_MAC
local ARP_IP	= SRC_IP_BASE

function configure(parser)
	parser:description("Generates UDP traffic and measure latencies. Edit the source to modify constants like IPs.")
    parser:argument("execution","The number of the current execution"):convert(tonumber)
end

function master(args)
    --****ADDED FOR MoonGui
    local config = moongui.getConfig(args.execution)
    local p = pipe:newSlowPipe()

	txDev = device.config{port = config.interfaces.tx, rxQueues = 3, txQueues = 3}
	rxDev = device.config{port = config.interfaces.rx, rxQueues = 3, txQueues = 3}
	device.waitForLinks()
	-- max 1kpps timestamping traffic timestamping
	-- rate will be somewhat off for high-latency links at low rates
	if tonumber(config.input.rate) > 0 then
		txDev:getTxQueue(0):setRate(tonumber(config.input.rate) - (tonumber(config.input.size) + 4) * 8 / 1000)
	end

	mg.startTask("server",p,args)
	mg.startTask("loadSlave", txDev:getTxQueue(0), rxDev, tonumber(config.input.size), tonumber(config.input.frame),p)
	mg.startTask("timerSlave", txDev:getTxQueue(1), rxDev:getRxQueue(1), tonumber(config.input.size), tonumber(config.input.frame),p)
	arp.startArpTask{
		-- run ARP on both ports
		{ rxQueue = rxDev:getRxQueue(2), txQueue = rxDev:getTxQueue(2), ips = RX_IP },
		-- we need an IP address to do ARP requests on this interface
		{ rxQueue = txDev:getRxQueue(2), txQueue = txDev:getTxQueue(2), ips = ARP_IP }
	}
	mg.waitForTasks()
end

local function fillUdpPacket(buf, len)
	buf:getUdpPacket():fill{
		ethSrc = queue,
		ethDst = DST_MAC,
		ip4Src = SRC_IP,
		ip4Dst = DST_IP,
		udpSrc = SRC_PORT,
		udpDst = DST_PORT,
		pktLength = len
	}
end

local function doArp()
	if not DST_MAC then
		log:info("Performing ARP lookup on %s", GW_IP)
		DST_MAC = arp.blockingLookup(GW_IP, 5)
		if not DST_MAC then
			log:info("ARP lookup failed, using default destination mac address")
			return
		end
	end
	log:info("Destination mac: %s", DST_MAC)
end
function server(p,args)
	moongui.server(p,args.execution,mg)
end
--TODO From here

function loadSlave(queue, rxDev, size, flows,p)
    doArp()
    local mempool = memory.createMemPool(function(buf)
        fillUdpPacket(buf, size)
    end)
    local bufs = mempool:bufArray()
    local counter = 0
    local txCtr = stats:newDevTxCounter(queue, "plain")
    local rxCtr = stats:newDevRxCounter(rxDev, "plain")
    local baseIP = parseIPAddress(SRC_IP_BASE)
    while mg.running() do
        bufs:alloc(size)
        for i, buf in ipairs(bufs) do
            local pkt = buf:getUdpPacket()
            pkt.ip4.src:set(baseIP + counter)
            counter = incAndWrap(counter, flows)
        end
        -- UDP checksums are optional, so using just IPv4 checksums would be sufficient here
        bufs:offloadUdpChecksums()
        queue:send(bufs)
        txCtr:update()
        rxCtr:update()
	local mpps = rxXtr:getStats(rxCtr)
	p:send({timer=socket.gettime(),rate=mpps})
	
    end
    txCtr:finalize()
    rxCtr:finalize()
end

function timerSlave(txQueue, rxQueue, size, flows,p)
    doArp()
    if size < 84 then
        log:warn("Packet size %d is smaller than minimum timestamp size 84. Timestamped packets will be larger than load packets.", size)
        size = 84
    end
    local timestamper = ts:newUdpTimestamper(txQueue, rxQueue)
    local hist = hist:new()
    mg.sleepMillis(1000) -- ensure that the load task is running
    local counter = 0
    local rateLimit = timer:new(0.001)
    local baseIP = parseIPAddress(SRC_IP_BASE)
    while mg.running() do
	local temp,latency = timestamper:measureLatency(size, function(buf)
            			fillUdpPacket(buf, size)
            			local pkt = buf:getUdpPacket()
            			pkt.ip4.src:set(baseIP + counter)
           			counter = incAndWrap(counter, flows)
        		end)
	hist:update(temp,latency)
	p:send({latency=latency,timer=socket.gettime()})
        rateLimit:wait()
        rateLimit:reset()
    end
    -- print the latency stats after all the other stuff
    mg.sleepMillis(300)
    hist:print()
end

