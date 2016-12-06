local json = require "dkjson"
local turbo = require "turbo"

local moongui = {}

-- Source stackoverflow.com
function moongui.subrange(t,first)
	local sub = {}
	local i = first
	while #t>=i and ((i-first)<=4000) do
		sub[#sub + 1] = t[i]
		i = i +1
	end
	return sub
end

function moongui.getConfig(execution)
    local configFile = assert(io.open("history/"..execution.."/config.json"))
    local configString = configFile:read("*all")
    local config = json.decode(configString,1,nil)
    return config
end

function moongui.server(p,mg)
	local dataStorage = {}

    local MoonGenDataHandler = class("MoonGenDataHandler",turbo.web.RequestHandler)

    function MoonGenDataHandler:get()--TODO Test
		local count = tonumber(self:get_argument("count","0"))
		local data = moongui.subrange(dataStorage,count)
		self:write({count=(#data+count),data=data})
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
	ioloop:set_interval(100, function()
		local a = p:tryRecv(0)
		local i=0
		while a~=nil and i<50 do
			table.insert(dataStorage,a)
			if i<50 then
				a=p:tryRecv(0)
			end
		end
	end
	)
    ioloop:start()
end

return moongui
