#!/bin/bash
sudo ../setup-hugetlbfs.sh
sudo ../bind-interfaces.sh
sudo luajit webserver.lua ${1:-8080}  
#luajit webserver.lua
