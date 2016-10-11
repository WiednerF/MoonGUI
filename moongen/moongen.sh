#!/bin/bash
sudo ../setup-hugetlbfs.sh
sudo ../bind-interfaces.sh
sudo ../MoonGen moongen/$1 $2
