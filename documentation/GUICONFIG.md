# MoonGUI configuration object
In this file is the documentation for adding new scripts to the configuration object of the graphical user interface or changing the current ones.
All configurations are stored in the file config/configuration.json as a JSON array with an object for each individual script, divided in the parts name, description, configuration and graph.
 Each of this parts is an divided name for an additional object, so the base structur is:
 `{"name":"moongui-lua","update":true,"description":...,"configuration":{...},"graph":{...}"`. The next sections are divided according to this information:
 
## Name
 This parts wants an String containing the name of the script file, like it is stored in the folder moongen. If it is stored in a subfolder, then it wants the
 complete path from the folder moongen. The ending `.lua` has to be included.
## Description
 This parts wants a description, which will be shown after the selection in the GUI for further information to this script. It needs an string value.
## Update
 This requires true or false, if the configuration should be updated on the running process or not 
## Configuration
 The configuration object needs two different objects, the interfaces (For the selection of network interfaces) and the input for additional input parameters. The configruation object looks like this:
 `{"interfaces":[...],"input":[...]}`. Both of the objects are containing a list of objects, which are described in the subsections below:
### Interfaces
 This is for the selection of the interfaces, like one script needs 1 and another script needs 2 or more interfaces, which can be defined here:
 + standard: Number of the default selected interface
 + name: The shown description Name for the gui
 + conf: The name of the parameter in the script configuration object submitted from the gui for the individual access
 + Example: `{"standard": 0,"name": "TX Interface","conf": "tx"}`
 
 ### Input
 This is the list of Additional Input Information. For this type, different types of input are available, which will be described in subsections after the default 
 values for every type:
 + type: Can be text, textArea, range, button or number
 + unit: A string value for the unit to be shown in the GUI
 + name: The name shown in the GUI as description for this input parameter
 + conf: The identifier used in the configuration object send to the script
 + standard: The default value for this parameter according to the type of input
 
 #### text
 Has no additional values. Example: `{"standard": 60,"type": "text","name": "Output","unit": "t","conf": "out"}`
 #### textArea
 Additional Values are th numbers for cols and rows for the columns and rows used in the textArea. Example: `{"standard": 60,"type": "text","name": "Output","unit": "t",
"conf": "out","cols": 10,"rows": 15}`

 #### number and range
 Additional number values are the values for min, max and step called in the same name. Example: `{"standard": 60,"type": "number","name": "Packet Size",
"unit": "B","conf": "size","max": 100000,"min": 10, "step": 1}`

 #### button
 Only following values without the one for the others, except type must be button: name (Name for the label) , parameter (Name for sending the button) and text (Name on the button)
 
 ## Graph
 In this object list, the different graphs shown and their input data is defined. Every graph is either a line or a historgam (graph) and has for this together
 values or divided ones. In Graph is only a list of values included, following are for both and in subsections are the ones only for a specific graph.
 + type: histogram or line (String)
 + title: The title as string in top of the graph
 + id: A unique id for the graph access in the GUI (Only unique in the same script)

 ### Histogram
 This are special inputs only for the histogram: 
 + travers: An List of Objects including the strings for x (The json name for sending the data) and title (The title of the travers)
 + range: An object using the input Variables max, min and step for the range slider
 + EXAMPLE: `{"type":"histogram","travers":[{"x":"latency"}],"range":{"max":1000,"min":0,"step":1},"size":4,"title":"Distribution of Latency","id":"hist"}`

 ### Line
  This are special inputs only for the line graph: 
  + travers: An List of Objects including the strings for x and y (The json name for sending the data) and title (The title of the travers)
  + max: The maximum on default visible data points
  + EXAMPLE: ` {"type":"line","travers":[{"x":"timer","title":"latency","y":"latency"}], "id":"line","max":"1000","title":"Live Latency"}`
