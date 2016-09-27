local io = require "io"
local mg = require "moongen"
local memory = require "memory"
local stats = require "stats"
local log = require "log"
local device = require "device"
local pipe = require "pipe"
local turbo = require "turbo"

function configure(parser)
	parser:argument("rxDev","The device to receive from"):convert(tonumber)
	parser:argument("txDev","The Device to send to"):convert(tonumber)
	parser:argument("port","The port for the Webserver"):convert(tonumber)
	parser:argument("execution","The number of the current execution"):convert(tonumber)
end


function master(args)
	--TODO Test
	local txDev = device.config{port = args.txDev,dropEnable = false}
	local rxDev = device.config{port = args.rxDev, dropEnable = false}
	device.waitForLinks()
	local p = pipe:newSlowPipe()
	mg.startTask("dumpSlave",rxDev:getRxQueue(0),txDev:getTxQueue(0),p)
	mg.startTask("server",p,args)
	mg.waitForTasks()
end

function dumpSlave(rxQueue,txQueue,p)
	local bufs = memory.bufArray()
	local pktCtr = stats:newPktRxCounter("Packets counted","plain")
	while mg.running() do
		local rx = rxQueue:tryRecv(bufs, 100)
		for i=1, rx do
			local buf = bufs[i]
			buf:dump()
			pktCtr:countPacket(buf)
	
		end
		bufs:free(rx)
		pktCtr:update()
	end
	pktCtr:finalize()
end

function server(p,args)
	
	turbo.web.Application({
	}):listen(args.port)
	print('Server started, listening on port:'..args.port)
	
	turbo.ioloop.instance():start()

end
