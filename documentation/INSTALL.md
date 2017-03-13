# MoonGUI Installation
This file describes all important informations related to the installation of MoonGui, starting with the pre install and built dependencies,
followed by installation instructions and the built instructions for the frontend.
## Submodule
This is designed to be used as submodule (Subfolder) of the MoonGen software, because this provides only the GUI and handling of the configuration, not the measurements. Please follow at first the Instruction of [MoonGen](https://github.com/emmericp/MoonGen) and add this thereafter as subfolder. 
## Dependencies
+ NPM: The package installer for NodeJS: Follow the instructions provided on the following page
[NodeJS Installation page](https://nodejs.org/en/download/package-manager/). 
+ NodeJS: NodeJS itself for building: Follow the instructions provided on the following page
[NodeJS Installation page](https://nodejs.org/en/download/). 
+ Install Angular-cli with `npm install -g angular-cli`
+ Luarocks: Luarocks is needed for the installation of all Lua dependendent Libraries for the webserver: Follow the installation instructions
on the following page [LuaRocks Installation page](https://github.com/luarocks/luarocks/wiki/Download).
+ If problems comes with invalid configuration object then do: `npm uninstall webpack --save-dev & npm install webpack@2.1.0-beta.22 --save-dev`

## Installation
For Installation of the Software rest dependencies and building MoonGen as well as all additional Dependencies of MoonGUI run in the 
MoonGUI folder with administrative priviliges the command : `make install` (On Unix Systems mostly: `sudo make install`).

## Built
After Installation or on every change (For example after every pull from this repository), you have to built the Angular2 files again.
For this run `make build`. If you want to built an development version (For debugging), which includes the not minified versions of
files, please run `make build-dev`.

## Starting
If you want to start the GUI, please run `make start` or `./start-webserver.sh`. The command knows one additional parameter
for starting the program with another port then 8080 as port for the webserver.
