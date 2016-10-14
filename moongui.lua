local json = require "dkjson"
local turbo = require "turbo"

local moongui = {}

function moongui.getConfig(execution)
    local configFile = assert(io.open("history/"..execution.."/config.json"))
    local configString = configFile:read("*all")
    local config = json.decode(configString,1,nil)
    return config
end

function moongui.zmqServer(p,execution, mg)
    local file = io.open("history/"..execution.."/data.json","a")
    local MoonGenDataHandler = class("MoonGenDataHandler",turbo.web.RequestHandler)

    function MoonGenDataHandler:get()
	local output = {}
	local a = p:tryRecv(0)
	local i=0
	while a~=nil and i<50 do
		file:write(json.encode(a),"\n")
		table.insert(output,a)
		if i<50 then
			a=p:tryRecv(0)
		end
	end
	self:write(output)
    end
	
    turbo.web.Application({
		{"^/data/$",MoonGenDataHandler}
	}):listen(4999)

    turbo.ioloop.instance():start()
end

return moongui