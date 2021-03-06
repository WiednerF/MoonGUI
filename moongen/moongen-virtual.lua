local mg = require "moongen"
local timer = require "timer"
local memory = require "memory"
local device = require "device"
local pipe = require "pipe"
local turbo = require "turbo"
local moongui = require "moongui"


local PKT_SIZE = 60

local NUM_PKTS = 10^20


function configure(parser)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	local config = moongui.getConfig(args.execution)
	local txDev = device.config{port = config.interfaces.rx,dropEnable = false}
	local rxDev = device.config{port = config.interfaces.tx, dropEnable = false}
	local p = pipe.newSlowPipe()
	if config.input.packetNr then
		NUM_PKTS=10^config.input.packetNr;
	end
	device.waitForLinks()
	mg.startTask("txTimestamper", txDev:getTxQueue(0))
	mg.startTask("rxTimestamper", rxDev:getRxQueue(0),p)
	moongui.server(p, mg)
end

function txTimestamper(queue)
	local mem = memory.createMemPool(function(buf)
		-- just to use the default filter here
		-- you can use whatever packet type you want
		buf:getUdpPtpPacket():fill{
		}
	end)
	mg.sleepMillis(1000) -- ensure that the load task is running
	local bufs = mem:bufArray(1)
	local rateLimit = timer:new(0.1) -- 1000kpps timestamped packets
	local i = 0
	while i < NUM_PKTS and mg.running() do
		bufs:alloc(PKT_SIZE)
		queue:sendWithTimestamp(bufs)
		rateLimit:wait()
		rateLimit:reset()
		i = i + 1
	end
	mg.sleepMillis(500)
	mg.stop()
end

function rxTimestamper(queue,p)
	local tscFreq = mg.getCyclesFrequency()
	local bufs = memory.bufArray(64)
	-- use whatever filter appropriate for your packet type
	queue:filterUdpTimestamps()
	local results = {}
	local rxts = {}
	while mg.running() do
		local numPkts = queue:recvWithTimestamps(bufs)
		for i = 1, numPkts do
			local rxTs = bufs[i].udata64
			local txTs = bufs[i]:getSoftwareTxTimestamp()
			results[#results + 1] = tonumber(rxTs - txTs) / tscFreq -- to nanoseconds
			rxts[#rxts + 1] = tonumber(rxTs)
			if #results>1 then
				p:send({results=results[#results],rxts=rxts[#rxts]})
			end
		end
		bufs:free(numPkts)
	end
end
