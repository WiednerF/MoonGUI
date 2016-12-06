# MoonGUI REST API
The connection between the client and server system is connected through a REST API over the HTTP protocol.
This connection is using the URI to describe resources and the http methods to describe, what to do with the resource. A resource is for example a running moongen process or the interface list.
 The answers are described by HTTP status codes to show, is it working correct or what happened. 
 Using this method reduces the overhead sending data over networks.

## HTTP Method Usage
 
 
 <table>
 <thead>
 <tr><th>Method</th><th>Usage</th><th>HTTP Body</th></tr>
 </thead>
 <tbody>
 <tr>
    <td>HEAD</td><td>Status Information with Status Code</td><td>No</td>
 </tr>
  <tr>
     <td>GET</td><td>Get the described resource</td><td>Yes</td>
  </tr>
   <tr>
      <td>POST</td><td>Create Resource</td><td>Yes</td>
   </tr>
    <tr>
       <td>DELETE</td><td>Destroy the resource</td><td>No</td>
    </tr>
 </tbody>
 <table>
## Entry Points
 
 In this sections every entry point and used methods as well as the answer is described.
 
### Default entry
 
 + URI: /
 + Method: GET
 + Response with the Default used GUI files (Static Response)
 
## Configuration Entry
 + URI: /config/
 + Reponse: Static GUI Configuration file under config/configuration.json
 
 ## REST API Entry
  This defines the Default Entry point to the REST API:
  + URI: /rest/
  
  ### Method HEAD
  + No Body, Nothing else
  + Response: 200 OK (When Server is running)
  
  ### Method DELETE
  + No Body, Nothing else
  + Acttion: Stops the Running Server
  + Response: 200 OK (Cannot happen, that it is not working)
  
  ##Interface Entry
  The Entry point for getting the list of usable interfaces for MoonGen and DPDK in the correct order.
  + URI: /rest/interfaces/
  + Method: GET
  + Action: Get a list of interfaces
  + Response: Array List of Interfaces: show (Names), index (id order)
  
  ## System Entry
  Is the entry for system relevant information:
  + URI: /rest/system/
  + Method: GET
  + Action: Calls different Methods to get system information
  + Response: JSON
  {os: Operating System, arch: Architecture x86 or x64, hostname: Hostname, user: User starting MoonGen, core: CPU cores,  lua:{ version: Lua Version, status: Lua Status } }
 
 ## History Entry
  Is build to delete or access direct to history files:
  + URI: /rest/history/
  + Method: DELETE
  + Action: Delete all files in the history folder
  + Response: 200 OK or 403 Failure
  
  ## MoonGen Start Entry
  In this part, the Running MoonGen process id can be get or a new process can be started for example:
  + URI: /rest/moongen/
  
  ### Method GET
  Returns the current running MoonGen Id or a empty object, if no process is currently running
  + Action: reads the Execution Number
  + Response: JSON {execution: Execution Number} or {}
  
  ### Method POST
  Starts a new Process, if no other MoonGen Process is currently running.
  + Action: Stores Config and starts a new process MoonGen
  + Body: Requires a JSON Configuration files, define by the config file for the GUI with necesary information:  title, author and script (MoonGen script to run with the server)
  + Response: JSON {execution: ID of execution}, if successfully
  
  ## MoonGen Running Entry
  This entry is working with a running process or will return status 404 if no one found at this entry:
  + URI: /rest/moongen/{executionNumber}/
  
  ### Method HEAD
  + Action: Search if the process is running at the moment
  + Response: status 200 if running or 412 if the process is stopped
  + No Body
  
  ### Method GET
 + Action: Returns the data from the actual count
 + Parameter: count (Number of already send data points)
 + Response: JSON {data: {List of data points},count:{Number already send included them send in this packet}}
 + Status: 200 if process is found
 
 ### Method DELETE
  + Action: Stopps the current running MoonGen process
  + Response: Status 200 for OK
  
  ## MoonGen Log Entry
  + Action: Reads the Log lines as HTML objects
  + Parameter: Seek for the beginning of the lines
  + Response: JSON {seek: {The number after this reponse}, log: {Lines of the log as array} }
  + Status: 200
