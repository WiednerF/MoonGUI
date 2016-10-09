#!/bin/bash
sudo ../setup-hugetlbfs.sh
sudo ../MoonGen moongen/moongen-server.lua $1
