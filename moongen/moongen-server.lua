local io = require "io"
local mg = require "moongen"
local timer = require "timer"
local ts = require "timestamping"
local hist = require "histogram"
local memory = require "memory"
local stats = require "stats"
local log = require "log"
local device = require "device"



local PKT_SIZE = 60

local NUM_PKTS = 10^20

function configure(parser)
	parser:argument("rxDev","The device to receive from"):convert(tonumber)
	parser:argument("txDev","The Device to send to"):convert(tonumber)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	--TODO TEST
	--TODO Packet number, size, rateLimit as Config parameters
	local txDev = device.config{port = args.txDev,dropEnable = false}
	local rxDev = device.config{port = args.rxDev, dropEnable = false}
	device.waitForLinks()
	mg.startTask("txTimestamper", txDev:getTxQueue(0))
	mg.startTask("rxTimestamper", rxDev:getRxQueue(0),args)
	mg.waitForTasks()
end

--TODO Load
function txTimestamper(queue)
	local mem = memory.createMemPool(function(buf)
		-- just to use the default filter here
		-- you can use whatever packet type you want
		buf:getUdpPtpPacket():fill{
		}
	end)
	mg.sleepMillis(1000) -- ensure that the load task is running
	local bufs = mem:bufArray(1)
	local rateLimit = timer:new(0.0000000001) -- 1000kpps timestamped packets
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

function rxTimestamper(queue,args)
	local tscFreq = mg.getCyclesFrequency()
	local bufs = memory.bufArray(64)
	-- use whatever filter appropriate for your packet type
	queue:filterUdpTimestamps()
	local results = {}
	local rxts = {}
	print(args.execution)
	local output = io.open("history/"..args.execution.."/data.json")
	while mg.running() do
		local numPkts = queue:recvWithTimestamps(bufs)
		for i = 1, numPkts do
			local rxTs = bufs[i].udata64
			local txTs = bufs[i]:getSoftwareTxTimestamp()
			results[#results + 1] = tonumber(rxTs - txTs) / tscFreq * 10^9 -- to nanoseconds
			rxts[#rxts + 1] = tonumber(rxTs)
			output:write(tostring({results=results[#results],rxts=rxts[#rxts]}).."\n")
		end
		bufs:free(numPkts)
	end
	output:close()
	local f = io.open("pings.txt", "w+")
	for i, v in ipairs(results) do
		f:write(v .. "\n")
	end
	f:close()
end
