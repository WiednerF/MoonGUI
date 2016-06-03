local turbo = require "turbo"
local io =    require "io"

if #arg < 2 then
	print('Usage: port logfile')
	os.exit()
end

local port = tonumber(arg[1])
local filename = arg[2]

local cachedLog = ''
local lastModified = ''
function readLog() 
	local file = assert(io.popen("stat -c=%y ".. filename, 'r'))	
	local modified = file:read('*a')
	file:close()
	if modified ~= lastModified then
		-- read logfile again
		local filehandle = io.input(filename)
		cachedLog =  io.read("*a")
		lastModified = modified
		print('cache modified file')
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

local app = turbo.web.Application:new({
	-- Serve single index.html file on root requests.
	{"^/$", turbo.web.StaticFileHandler, "index.html"},
	-- Server csv data
	{"^/stdout/(.*)$", MoonGenStdOutHandler},
	-- Serve contents of directory.
	{"^/(.*)$", turbo.web.StaticFileHandler, "files/"}
})	

local srv = turbo.httpserver.HTTPServer(app)
srv:bind(port)
srv:start(1) -- Adjust amount of processes to fork.
print('Server started, listening on port: ' .. port)

turbo.ioloop.instance():start()
