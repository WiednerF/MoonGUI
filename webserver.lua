local http = require "socket.http"
local turbo = require "turbo"
local io =    require "io"
local jit = require "jit"
local json = require "dkjson"

if #arg < 1 then
	print('Usage: port for webserver')
	os.exit()
end

local executionNumber = nil --The current executionNumber if a process runs or nil for no running process
local port = tonumber(arg[1])
local pid = nil --The current pid of the running process
local running = true

--SOURCE: https://gist.github.com/ignisdesign/4323051
function urlencode(str)
   if (str) then
      str = string.gsub (str, "([^%w ])",
         function (c) return string.format ("%%%02X", string.byte(c)) end)
   end
   return str    
end

--Read the log file with less access
function readLog(file,seekInput)
	local seek = seekInput
	local log = io.open(file,"r")
	if log == nil then
		return {},0
	end
	if seek == log:seek("end") then
		return {},seek
	end
	local seekEnd = log:seek("end")
	local MAX = 100
	local x = 0
	local output = {}
	log:seek("set",seek)
	if seek+MAX>seekEnd then
		MAX = seekEnd-seek
	end
	for line in log:lines() do
		if not string.find(line,"descriptor 53") then		
			local f = assert(io.popen("echo '"..line.."' | ./ansi2html.sh --body-only "))
			local s = assert(f:read("*a"))
			f:close()
			table.insert(output, urlencode(s))
			x= x +1
		end
		seek= log:seek()
		coroutine.yield(output,seek)
		if x > MAX then
			break
		end
	end
	seek = log:seek()
	
	return output,seek
end

--Read the data
function readData(count)
	local response,status,content= http.request('http://localhost:4999/data/?count=' .. count)
	if status==200 then
		return response
	end
	return '{"count":'..count..',"data":[]}'
end

local ConnectHandler = class("ConnectHandler", turbo.web.RequestHandler)
function ConnectHandler:head()
		print("Connection Tested to REST API")
end
function ConnectHandler:delete()
	running = false
end
--*********************************************
--Starting of MOONGEN
local MoonGenStartHandler = class("MoonGenStartHandler", turbo.web.RequestHandler)
function MoonGenStartHandler:post() 
	print("Start MoonGen Process")
	--Generating the Execution Number
	local configurationObject = self:get_json(true)
	executionNumber = math.random(1000)
	--Making folder and write number to history file
	local cmd ="mkdir -p history/"..executionNumber.."/"
	os.execute(cmd)
	local configurationFile = io.open("history/"..executionNumber.."/config.json","a")
	configurationFile:write(json.encode(configurationObject,{indent= true}))
	configurationFile:close()
	local historyFile = io.open("history/history-number","a")
	historyFile:write(executionNumber..";"..configurationObject.title..";"..configurationObject.script..";"..os.date("%x %X")..";\n")
	historyFile:close()
	--Executing Standard MoonGen Script
	cmd = "nohup moongen/moongen.sh "..configurationObject.script.." "..executionNumber.." > history/"..executionNumber.."/run.log & echo $! > history/"..executionNumber.."/pid.log"
	print(cmd)
	os.execute(cmd)
	print("Execution number:"..executionNumber)
	self:write({execution=executionNumber})
end

function MoonGenStartHandler:get()--Generates the Number of the current execution
	print("Get Information List of Execution Number")
	if executionNumber~=nil then	
		self:write({execution=executionNumber})
	else
		self:write({})
	end
end
--*********************************************
--Normal MoonGen Behaviour
local MoonGenDefaultHandler = class("MoonGenDefaultHandler",turbo.web.RequestHandler)
function MoonGenDefaultHandler:delete(execution)
	if tonumber(execution)==executionNumber then
		if pid == nil then
			local f = io.open("history/"..executionNumber.."/pid.log","r")
			pid = tonumber(f:read("*number"))
		end
		
		local cmd = "kill "..pid 
		print(cmd)
		local f = io.popen(cmd)
		f:read("*all")
		f = io.popen("pkill MoonGen")
		f:read("*all")
		f = io.popen("pkill MoonGen")
		f:read("*all")
		pid = nil
		executionNumber=nil
	else
		self:set_status(404)
	end

end
function MoonGenDefaultHandler:head(execution)
	if tonumber(execution)==executionNumber then
		if pid == nil then
			local f = io.open("history/"..executionNumber.."/pid.log","r")
			pid = tonumber(f:read("*number"))
		end
		local status = io.popen("ps -q "..pid.." | grep "..pid)
		local result = status:read("*line")
		if result == nil then
			self:set_status(412)
		else
			self:set_status(200)
		end
	else
		self:set_status(404)
	end
end


function MoonGenDefaultHandler:get(execution)
	if tonumber(execution)==executionNumber then
		local count = tonumber(self:get_argument("count","0"))
		local data = readData(count)
		self:write(data)
	else
		self:set_status(404)
	end
end

function MoonGenDefaultHandler:put(execution)
	if tonumber(execution)==executionNumber then
		local configurationObject = self:get_json(true)
		local configurationFile = io.open("history/"..executionNumber.."/config.json","w")
		configurationFile:write(json.encode(configurationObject,{indent= true}))
		configurationFile:close()
	else
		self:set_status(404)
	end
end
--***********MOONGEN LOG*******************************
local MoonGenLogHandler = class("MoonGenLogHandler",turbo.web.RequestHandler)
function MoonGenLogHandler:get(execution)
		if tonumber(execution)==executionNumber then
			local start = os.time()			
			local seek = tonumber(self:get_argument("seek","0"))
			local co = coroutine.create(--Creates the coroutine for working on the thread
				function(log,seek)
					return readLog(log,seek)
				end			
			)	
			local errorstatus,log,seekNew = coroutine.resume(co,"history/"..executionNumber.."/run.log",seek)			
			while coroutine.status(co) ~= "dead" and os.time()-start<3000 do--Get each line, so stopping is possible
					errorstatus,log,seekNew = coroutine.resume(co)		
			end
			if not seekNew~=nil then
				self:write({log=log,seek=seekNew})
			else
				self:write({log=log,seek=seek})			
			end
		else
			self:set_status(404)
		end
end
--***********MOONGEN Button Action Handler
local MoonGenButtonHandler = class("MoonGenButtonHandler",turbo.web.RequestHandler)
function MoonGenButtonHandler:put(execution)
	if tonumber(execution)==executionNumber then	
			local button = self:get_argument("button","noButton")
			io.write(button)
		else
			self:set_status(404)
		end
end

--*******************SYSTEM
local SystemHandler = class("SystemHandler",turbo.web.RequestHandler)
function SystemHandler:get()
	local command = io.popen("hostname","r")
	local hostname = command:read()
	command = io.popen("whoami","r")
	local user = command:read()
	command = io.popen("nproc","r")
	local nproc = tonumber(command:read())
	self:write({os=jit.os,arch=jit.arch,hostname=hostname,user=user,lua={version=jit.version,status=jit.status()},cores=nproc})
end

local InterfaceHandler = class("InterfaceHandler",turbo.web.RequestHandler)
function InterfaceHandler:get()
	local file = assert(io.popen("./dpdk-interfaces.py --status"))
	local output = {}
	local i = 0
	for line in file:lines() do
	    table.insert(output,{show=line,index=i})
	    i=i+1
	end
	self:write(output)
end

local HistoryHandler = class("HistoryHandler",turbo.web.RequestHandler)
function HistoryHandler:delete()
	local cmd = "rm -rf history/*"
	local command = io.popen(cmd)
	local rest = command:read()
end
 

local app = turbo.web.Application:new({
	-- Serve single index.html file on root requests.
	{"^/$", turbo.web.StaticFileHandler, "moongui/dist/index.html"},
	-- Serve Connection availability
	{"^/rest/$",ConnectHandler},
	-- Start the MoonGen Handler Function
	{"^/rest/moongen/$",MoonGenStartHandler},
	{"^/rest/moongen/(.*)/log/$",MoonGenLogHandler},
	{"^/rest/moongen/(.*)/button/$",MoonGenButtonHandler},
	{"^/rest/moongen/(.*)/$",MoonGenDefaultHandler},
	--Get System Information
	{"^/rest/system/$",SystemHandler},
	{"^/rest/interfaces/$",InterfaceHandler},
	{"^/config/$",turbo.web.StaticFileHandler, "config/configuration.json"},
	-- History API
	{"^/rest/history/$",HistoryHandler},
	-- Serve contents of directory.
	{"^/(.*)$", turbo.web.StaticFileHandler, "moongui/dist/"}
})	

local srv = turbo.httpserver.HTTPServer(app)
srv:bind(port)
srv:start(1) -- Adjust amount of processes to fork.
print('Server started, listening on port: ' .. port)
local ioloop = turbo.ioloop.instance()
ioloop:set_interval(500,function()
	if not running then
		ioloop:close()
	end
end)
ioloop:start()
