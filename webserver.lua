local turbo = require "turbo"
local io =    require "io"

if #arg < 1 then
	print('Usage: port for webserver')
	os.exit()
end

function readAll(file)
    local f = io.open(file, "rb")
    local content = f:read("*all")
    f:close()
    return content
end

local executionNumber = nil
local port = tonumber(arg[1])

local ConnectHandler = class("ConnectHandler", turbo.web.RequestHandler)
function ConnectHandler:head()
		print("Connection Tested to REST API")
end
local MoonGenStartHandler = class("MoonGenStartHandler", turbo.web.RequestHandler)
function MoonGenStartHandler:post() 
	print("Start MoonGen Process")
	executionNumber = math.random(1000)
	local cmd ="mkdir -p history/"..executionNumber.."/"
	local historyFile = io.open("history/history-number","a")
	print(cmd)
	os.execute(cmd)
	historyFile:write(executionNumber.."\n")
	historyFile:close()
	print("Execution number:"..executionNumber)
	self:write({execution=executionNumber})
end
function MoonGenStartHandler:get()
	print("Get Informationen List of PIDs")
	self:write({execution=executionNumber})
end
local MoonGenDefaultHandler = class("MoonGenDefaultHandler",turbo.web.RequestHandler)
function MoonGenDefaultHandler:delete(execution)
	if tonumber(execution)==executionNumber then
		executionNumber=nil
	else
		self:set_status(404)
	end

end
local MoonGenLogHandler = class("MoonGenLogHandler",turbp.web.RequestHandler)
function MoonGenLogHandler:get(execution)
		if tonumber(execution)==executionNumber then
			print(self:get_json(true));
			self:write(readAll("history/history-number"))
		else
			self:set_status(404)
		end
end 

local app = turbo.web.Application:new({
	-- Serve single index.html file on root requests.
	{"^/$", turbo.web.StaticFileHandler, "moonGui2/dist/index.html"},
	-- Serve Connection availability
	{"^/rest/$",ConnectHandler},
	-- Start the MoonGen Handler Function
	{"^/rest/moongen/$",MoonGenStartHandler},
	{"^/rest/moongen/(.*)/log/$",MoonGenLogHandler},
	{"^/rest/moongen/(.*)/$",MoonGenDefaultHandler},
	-- Serve contents of directory.
	{"^/(.*)$", turbo.web.StaticFileHandler, "moonGui2/dist/"}
})	

local srv = turbo.httpserver.HTTPServer(app)
srv:bind(port)
srv:start(1) -- Adjust amount of processes to fork.
print('Server started, listening on port: ' .. port)

turbo.ioloop.instance():start()
