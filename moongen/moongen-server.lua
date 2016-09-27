local io = require "io"
local mg = require "moongen"
local timer = require "timer"
local ts = require "timestamping"
local hist = require "histogram"
local memory = require "memory"
local stats = require "stats"
local log = require "log"
local device = require "device"
local zmq = require "zmq"

function configure(parser)
	parser:argument("rxDev","The device to receive from"):convert(tonumber)
	parser:argument("txDev","The Device to send to"):convert(tonumber)
	parser:argument("port","The port for the Webserver"):convert(tonumber)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	--TODO Test
	--PIPE Part
	local ctx = zmq.init()
	local s = ctx:socket(zmq.REQ)
	s:connect("tcp://localhost:5555")

	local txDev = device.config{port = args.txDev,dropEnable = false}
	local rxDev = device.config{port = args.rxDev, dropEnable = false}
	device.waitForLinks()
	mg.startTask("dumpSlave",rxDev:getRxQueue(0),txDev:getTxQueue(0))
	mg.waitForTasks()
	s:close()
	ctx:term()
end

function dumpSlave(rxQueue,txQueue)
	local timestamper = ts:newTimestamper(txQueue, rxQueue)
	local hist = hist:new()
	while mg.running() do
		hist:update(timestamper:measureLatency())
		print(hist:avg())
	end
	hist:print()
end
