local json = require "dkjson"
local zmq = require "lzmq"

local moongui = {}

function moongui.getConfig(execution)
    local configFile = assert(io.open("history/"..execution.."/config.json"))
    local configString = configFile:read("*all")
    local config = json.decode(configString,1,nil)
    return config
end

function moongui.zmqServer(p,execution, mg)
    local ctx = zmq.context()
    local s = ctx:socket(zmq.REP)
    s:bind("tcp://127.0.0.1:5556")
    local file = io.open("history/"..execution.."/data.json","a")
    while mg.running() do
        local str = "{"
        assert(s:recv())
        local a = p:tryRecv(0)
        local i=0
        while a~=nil and i<100 do
            file:write(a,"\n")
            str=str..a..","
            i=i+1
            if i<100 then
                a=p:tryRecv(0)
            end
        end
        if str~="{" then
            str=string.sub(str,1,-2)
        end
        str=str.."}"
        assert(s:send(str))
    end
    file:close()
end

return moongui