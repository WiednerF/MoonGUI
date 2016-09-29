local turbo = require "turbo"
local io =    require "io"
local zmq = require "zmq"

if #arg < 1 then
	print('Usage: port for webserver')
	os.exit()
end

--SOURCE: https://gist.github.com/ignisdesign/4323051
function urlencode(str)
   if (str) then
      str = string.gsub (str, "\n", "\r\n")
      str = string.gsub (str, "([^%w ])",
         function (c) return string.format ("%%%02X", string.byte(c)) end)
      str = string.gsub (str, " ", "+")
   end
   return str    
end

--SOURCE: http://tinybrain.de:8080/tb/show-snippet.php?id=1004715
function toLines(str)
  local t = {}
  local function helper(line) table.insert(t, urlencode(line)) return "" end
  helper((str:gsub("(.-)\r?\n", helper)))
  return t
end

function readLog(file,lines)
	local log = io.open(file,"r")
	if log == nil then
		return {}
	end
	local content = log:read("*a")
	local output = toLines(content)
	if output==nil or table.getn(output)<= lines then
		return {}
	end
	if lines == 0 then
		return output
	end 
	return table.remove(output,lines)
end

local executionNumber = 59 -- TODO Change to nil
local port = tonumber(arg[1])

local ConnectHandler = class("ConnectHandler", turbo.web.RequestHandler)
function ConnectHandler:head()
		print("Connection Tested to REST API")
end
--*********************************************
--Starting of MOONGEN
local MoonGenStartHandler = class("MoonGenStartHandler", turbo.web.RequestHandler)
function MoonGenStartHandler:post() 
	print("Start MoonGen Process")
	--Generating the Execution Number
	executionNumber = math.random(1000)
	--Making folder and write number to history file
	local cmd ="mkdir -p history/"..executionNumber.."/"
	os.execute(cmd)
	local historyFile = io.open("history/history-number","a")
	historyFile:write(executionNumber.."\n")
	historyFile:close()
	--Executing Standard MoonGen Script
	cmd = "nohup moongen/moongen.sh "..executionNumber.." > history/"..executionNumber.."/run.log & echo $! > history/"..executionNumber.."/pid.log"
	print(cmd)
	os.execute(cmd)
	print("Execution number:"..executionNumber)
	self:write({execution=executionNumber})
end
function MoonGenStartHandler:get()
	print("Get Informationen List of Execution Number")
	self:write({execution=executionNumber})
end
--*********************************************
--Normal MoonGen Behaviour
local MoonGenDefaultHandler = class("MoonGenDefaultHandler",turbo.web.RequestHandler)
function MoonGenDefaultHandler:delete(execution)
	if tonumber(execution)==executionNumber then
		--TODO Stop process
		--TODO Get Process Status
		executionNumber=nil
	else
		self:set_status(404)
	end

end
function MoonGenDefaultHandler:get(execution)
	if tonumber(execution)==executionNumber then
		print(self:get_json(true));
		self:write(readAll("history/"..execution.."/data.json"))
	else
		self:set_status(404)
	end
end

local MoonGenLogHandler = class("MoonGenLogHandler",turbo.web.RequestHandler)
function MoonGenLogHandler:get(execution)
		if tonumber(execution)==executionNumber then
			local lineNumber = tonumber(self:get_argument("lines","0"))
			local log=readLog("history/"..executionNumber.."/run.log",lineNumber)--TODO Error
			self:write({log=log,lines=(table.getn(log)+lineNumber)})
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
