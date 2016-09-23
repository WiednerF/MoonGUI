local mg = require "moongen"
local memory = require "memory"
local stats = require "stats"
local log = require "log"
local device = require "device"
local pipe = require "pipe"

function configure(parser)
	parser:argument("rxDev","The device to receive from"):convert(tonumber)
	parser:argument("txDev","The Device to send to"):convert(tonumber)
	parser:argument("port","The port for the Webserver"):convert(tonumber)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	--TODO
	local txDev = device.config{port = args.txDev,dropEnable = false}
	local rxDev = device.config{port = args.rxDev, dropEnable = false}
	local p = pipe:newSlowPipe()
--	dpdk.waitForSlaves()
end
