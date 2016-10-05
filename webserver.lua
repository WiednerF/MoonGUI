local turbo = require "turbo"
local io =    require "io"
local jit = require "jit"
local json = require "dkjson"

if #arg < 1 then
	print('Usage: port for webserver')
	os.exit()
end

--SOURCE: https://gist.github.com/ignisdesign/4323051
function urlencode(str)
   if (str) then
      str = string.gsub (str, "([^%w ])",
         function (c) return string.format ("%%%02X", string.byte(c)) end)
   end
   return str    
end

function readLog(file,seek)
	local log = io.open(file,"r")
	if log == nil then
		return {},0
	end
	if seek == log:seek("end") then
		return {},seek
	end
	local MAX = 100
	local x = 0
	local output = {}
	log:seek("set",seek)
	for line in log:lines() do
		if not  string.find(line,"descriptor 53") then
			table.insert(output, line)
			x= x +1
		end
		if x > MAX then
			break
		end
	end
	seek = log:seek()

	for i,v in ipairs(output) do
		local f = assert(io.popen("echo '"..v.."' | ./ansi2html.sh --body-only "))
		local s = assert(f:read("*a"))
		f:close()
		output[i]=urlencode(s)
	end
	
	return output,seek
end

function readData(file,seek)
	local file = io.open(file,"r")
	if file==nil then
		return {},seek
	end
	if seek==file:seek("end") then
		return {},seek
	end
	local MAX = 10
	local x = 0
	local output = {}
	file:seek("set",seek)
	for line in file:lines() do
		local result = loadstring("return "..line)
		local result2 = result();
		result2.results=(math.floor(tonumber(result2.results)*10^18+0,5)/10^18);		
		table.insert(output,result2)
	end
	seek = file:seek()
	return output,seek
end

local executionNumber = 646
local port = tonumber(arg[1])
local pid = nil

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
	local configurationObject = self:get_json(true)
	executionNumber = math.random(1000)
	--Making folder and write number to history file
	local cmd ="mkdir -p history/"..executionNumber.."/"
	os.execute(cmd)
	local configurationFile = io.open("history/"..executionNumber.."/config.json","a")
	configurationFile:write(json.encode(configurationObject,{indent= true}))
	configurationFile:close()
	local historyFile = io.open("history/history-number","a")
	historyFile:write(executionNumber..";"..configurationObject.title.."\n")
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
		if pid == nil then
			local f = io.open("history/"..executionNumber.."/pid.log","r")
			pid = tonumber(f:read("*number"))
		end
		local cmd = "kill "..pid --TODO Error Deleting not working
		print(cmd)
		local f = io.popen(cmd)
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
		local seek=tonumber(self:get_argument("seek","0"))
		local data,seek = readData("history/"..executionNumber.."/data.json",seek)
		self:write({seek=seek,data=data})
	else
		self:set_status(404)
	end
end

local MoonGenLogHandler = class("MoonGenLogHandler",turbo.web.RequestHandler)
function MoonGenLogHandler:get(execution)
		if tonumber(execution)==executionNumber then
			local seek = tonumber(self:get_argument("seek","0"))
			local log,seek=readLog("history/"..executionNumber.."/run.log",seek)
			self:write({log=log,seek=seek})
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

local app = turbo.web.Application:new({
	-- Serve single index.html file on root requests.
	{"^/$", turbo.web.StaticFileHandler, "moonGui2/dist/index.html"},
	-- Serve Connection availability
	{"^/rest/$",ConnectHandler},
	-- Start the MoonGen Handler Function
	{"^/rest/moongen/$",MoonGenStartHandler},
	{"^/rest/moongen/(.*)/log/$",MoonGenLogHandler},
	{"^/rest/moongen/(.*)/$",MoonGenDefaultHandler},
	--Get System Information
	{"^/rest/system/$",SystemHandler},
	{"^/rest/interfaces/$",InterfaceHandler},
	-- Serve contents of directory.
	{"^/(.*)$", turbo.web.StaticFileHandler, "moonGui2/dist/"}
})	

local srv = turbo.httpserver.HTTPServer(app)
srv:bind(port)
srv:start(1) -- Adjust amount of processes to fork.
print('Server started, listening on port: ' .. port)

turbo.ioloop.instance():start()
