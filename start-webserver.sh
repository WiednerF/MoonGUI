#!/bin/bash
sudo ../setup-hugetlbfs.sh
sudo ../bind-interfaces.sh
sudo luajit webserver.lua 8080  
#luajit webserver.lua
