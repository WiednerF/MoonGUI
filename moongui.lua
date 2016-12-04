local json = require "dkjson"
local turbo = require "turbo"

local moongui = {}

function moongui.getConfig(execution)
    local configFile = assert(io.open("history/"..execution.."/config.json"))
    local configString = configFile:read("*all")
    local config = json.decode(configString,1,nil)
    return config
end

function moongui.server(p,execution,mg)
    local MoonGenDataHandler = class("MoonGenDataHandler",turbo.web.RequestHandler)

    function MoonGenDataHandler:get()
	local init = os.time()
	local current = os.time()
	local output = {}
	local a = p:tryRecv(0)
	local i=0
	while a~=nil and i<50 and current-init<50 do--TODO Test value for time
		table.insert(output,a)
		current = os.time()
		if i<50 and current-init<50 then
			a=p:tryRecv(0)
		end
	end
	self:write(output)
    end
	
    turbo.web.Application({
		{"^/data/$",MoonGenDataHandler}
	}):listen(4999)
	local ioloop = turbo.ioloop.instance()
	ioloop:set_interval(300, function()
			if not mg.running() then
				ioloop:close()
			end
		end
	)
    ioloop:start()
end

return moongui
