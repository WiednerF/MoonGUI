# MoonGui - A Graphical User Interface for MoonGen
This is a Graphical User Interface for Network Analysis of the basic from MoonGen.
You can find more information to MoonGen on [MoonGen Github](https://github.com/emmericp/MoonGen).
This project is written for LuaJIT on the Backend and for Angular2 in the frontend.

## Dependencies
For Further information see documentation on installation [installation](INSTALL.md)

## Installation
For further installation documentation see [installation](INSTALL.md)

## Build Project
For further documentation to build the project see [Installation](INSTALL.md)

## Run the Project
For further documentation see [Installation](INSTALL.md)

## Documentation
The documentation for this project is splitted into different parts, divided by the architecture of
the programm. The Architecture of the Program can be seen in [Architecture](ARCH.md)
### Script API
For further documentation to build own scripts see [ScriptAPI](SCRIPTAPI.md)
### Configuration of the Graphical User Interface
For further documentation to Add Scripts to the GUI see [GUI CONFIG](GUICONFIG.md)
### REST API
For further documentation to the REST API see [REST API](RESTAPI.md)

### Additional Make targets
<table>
<thead>
<tr><th>Target</th><th>Description</th></tr>
</thead>
<tbody>
<tr>
<td>all</td><td>Will install and build the project</td>
</tr>
<tr>
<td>install</td><td>Downloading all not prior described dependencies and install them (Needs sudo)</td>
</tr>
<tr>
<td>build</td><td>Build the project</td>
</tr>
<tr>
<td>build-dev</td><td>Build the development version of the angular2 script</td>
</tr>
<tr>
<td>clean</td><td>Cleans the cache</td>
</tr>
<tr>
<td>start</td><td>Starts the webserver of the GUI</td>
</tr>
</tbody>
<table>
