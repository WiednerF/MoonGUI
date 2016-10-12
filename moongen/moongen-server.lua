local io = require "io"
local mg = require "moongen"
local timer = require "timer"
local ts = require "timestamping"
local hist = require "histogram"
local memory = require "memory"
local stats = require "stats"
local log = require "log"
local device = require "device"
local json = require "dkjson"
local pipe = require "pipe"
local zmq = require"lzmq"


local PKT_SIZE = 60

local NUM_PKTS = 10^20


function configure(parser)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	--TODO Add the other scripts to the working one
	local configFile = assert(io.open("history/"..args.execution.."/config.json"))
	local configString = configFile:read("*all")
	local config,pos,error = json.decode(configString,1,nil)
	local txDev = device.config{port = config.interfaces.rx,dropEnable = false}
	local rxDev = device.config{port = config.interfaces.tx, dropEnable = false}
	local p = pipe.newSlowPipe()
	if config.input.packetNr then
		NUM_PKTS=10^config.input.packetNr;
	end
	device.waitForLinks()
	mg.startTask("txTimestamper", txDev:getTxQueue(0),config)
	mg.startTask("rxTimestamper", rxDev:getRxQueue(0),config,p)
	mg.startTask("zmqServer",p,args)
	mg.waitForTasks()
end

function zmqServer(p,args)
	local ctx = zmq.context()
        local s = ctx:socket(zmq.REP)
        s:bind("tcp://127.0.0.1:5556")
	local file = io.open("history/"..args.execution.."/data.json","a")
	while mg.running() do
		local str = "{"
		assert(s:recv())
		local a = p:tryRecv(0)
		local i=0	
		while a~=nil and i<100 do
			file:write(a,"\n")
			str=str..a..","
			i=i+1
			if i<100 then
				a=p:tryRecv(0)
			end
		end
		if str~="{" then
			str=string.sub(str,1,-2)	
		end
		str=str.."}"
	 	assert(s:send(str))
	end
	file:close()	
end

--TODO Load
function txTimestamper(queue,config)
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

function rxTimestamper(queue,config,p)
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
			p:send("{results="..results[#results]..",rxts="..rxts[#rxts].."}")
		end
		bufs:free(numPkts)
	end
end
