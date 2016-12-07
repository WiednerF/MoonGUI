# MoonGUI Script configuration
In this documentation part, the information needed to change a running MoonGen Script into a script working with the Graphical User Interface for MoonGen
and the description, what will be added to your script, automatically.

## Imports
Two to three imports are needed for the MoonGUI to work correctly in the main part of the script:
+ `local pipe = require "pipe"` For the slowPipe for sending data to the server
+ `local socket = require "socket"` Only needed, if the socket is used for timestamping
+ `local moongui = require "moongui"` Contains the logic running in the MoonGen script to use it with the GUI

## Configuration
In the function configure, the configuration options must be removed completly, because they can not be used with the MoonGUI and
the following configuration option must be added to get the execution number from the main process for receiving the configuration object: `parser:argument("execution","The number of the current execution"):convert(tonumber)`.

## Master Process
The most changed must be made in the Master process, because all configuration options are not comming from the commandline, they are comming from the GUI. Because of this, at first the configuration object has to be loaded. For this add the following to your script in the master function: `local config = moongui.getConfig(args.execution)`. The next is, that to be able to send data to the server and the GUI, a slowPipe must be generated, so add as next line the following: `local p = pipe:newSlowPipe()`. The next step is to use the configuration options submited from the major process: All interfaces can be found under `config.interfaces` and the name configured in the configuration object. All input parameter can be found in the same way under the object `config.input`. Just use this values insteed of the previous used commandline parameters. The next step is, that every task, who will submit data to the GUI, must be given as argument, the previous defined slowPipe `p`. The last thing is that, the last line with waiting for the task must be removed and the following line must be added insteed `moongui.server(p, mg)`. P is the slowPipe and mg is the MoonGen process. This methods starts the data interface and the collecting of data from  the slowPipe.

## Slave Process
In the slave processes only the one must be changed, which have to send data. This data is send as a Lua object with the slowPipe to the server for submit to the GUI. For this, the data has to be send according to the configuration for the graphs in the configuration object. The following is an example: `p:send({latency=latency,timer=socket.gettime()})`.

## Information
To the main process, a webserver is added sending the information to the server and collecting the data send from the slowPipe process. The configuration object is stored as file and is then provided as Lua object for the direct use in the script and will be loaded with the moongui lua file. Nothing more is added or changed in the script file, to reduce the time needed to add new scripts with having as much flexibility as possible.

## Hints
Three example files are provided:
+ [l3-load-latency.lua](../moongen/l3-load-latency.lua)
+ [moongen-virtual.lua](../moongen/moongen-virtual.lua)
+ [quality-of-service-test.lua](../moongen/quality-of-service-test.lua)
