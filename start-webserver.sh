#!/bin/bash

if ! [ -a moongenio ] ; then
	touch moongenio
fi
luajit webserver.lua 8080 moongenio 
#luajit webserver.lua
