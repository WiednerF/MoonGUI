local turbo = require "turbo"
local io =    require "io"

if #arg < 1 then
	print('Usage: port')
	os.exit()
end

local port = tonumber(arg[1])
local filename = 'moongen'

local cachedLog = ''
local lastModified = ''
function readLog()
	local cmd = "stat -c=%y ".. filename .. ".log"
	print (cmd)
	local file = assert(io.popen(cmd, 'r'))	
	local modified = file:read('*a')
	file:close()
	if modified ~= lastModified then
		-- read logfile again
		cmd = "./ansi2html.sh --body-only < " .. filename .. ".log" 
		print(cmd)
		local filehandle = io.popen(cmd)
		cachedLog =  filehandle:read("*a")
		lastModified = modified
		print('cache modified file')
		filehandle:close()
	end	
	return cachedLog
end

local MoonGenStdOutHandler = class("MoonGenStdOutHandler", turbo.web.RequestHandler)
function MoonGenStdOutHandler:get()
	local a = readLog() 
	if a ~= nil then
		self:write({log=a})
	else
		self:write({x=0, value=1, othervalue=20})
	end 
end

local pidresult = ''
local ProcessStarterHandler = class("ProcessStarterHandler", turbo.web.RequestHandler)
function ProcessStarterHandler:get()
	local cmd = "nohup ../build/MoonGen ../examples/l3-load-latency.lua 8 9 > ansi2html > " .. filename .. ".log & echo $! > " .. filename .. "-pid.log "
	print (cmd)
	os.execute(cmd)
	local handle = io.input(filename .. "-pid.log")
	pidresult = io.read("*a")
	print ("Start process with PID " .. pidresult)
	handle:close()
	self:write({pid = pidresult})
end

local ProcessKillerHandler = class("ProcessKillerHandler", turbo.web.RequestHandler)
function ProcessKillerHandler:get()
        local cmd = "kill " .. pidresult
        --print (cmd)
	os.execute(cmd)
        print ("Kill process with PID " .. pidresult)
        self:write({pid = pidresult})
end

local ConnectHandler = class("ConnectHandler", turbo.web.RequestHandler)
function ConnectHandler:head()
		print("Connection Tested to REST API")
end

local app = turbo.web.Application:new({
	-- Serve single index.html file on root requests.
	{"^/$", turbo.web.StaticFileHandler, "moonGui2/dist/index.html"},
	-- Serve Connection availability
	{"^/rest/$",ConnectHandler},
	-- Serve log data
	{"^/log/(.*)$", MoonGenStdOutHandler},
	-- Serve start processes
	{"^/startprocess$", ProcessStarterHandler},
        -- Serve kill processes
        {"^/killprocess$", ProcessKillerHandler},
	-- Serve contents of directory.
	{"^/(.*)$", turbo.web.StaticFileHandler, "moonGui2/dist/"}
})	

local srv = turbo.httpserver.HTTPServer(app)
srv:bind(port)
srv:start(1) -- Adjust amount of processes to fork.
print('Server started, listening on port: ' .. port)

turbo.ioloop.instance():start()
