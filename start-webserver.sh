#!/bin/bash
sudo ../setup-hugetlbfs.sh
sudo ../bind-interfaces.sh
sudo ../libmoon/deps/luajit/usr/local/bin/luajit-2.1.0-beta2 webserver.lua ${1:-8080}  
#luajit webserver.lua
