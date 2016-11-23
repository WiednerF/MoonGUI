# MakeFile for the basics of MoonGUI development

all: clean install build

install:
	git submodule init
	cd ../
	./build.sh
	cd webserver/
	luarocks install turbo
	luarocks install luasocket
	cd moongui
	make install
	cd ../

build:
		cd moongui
		make build
		cd ../

build-dev:
	cd moongui
	make build-dev
	cd ../

clean:
	cd moongui
	make clean
	cd ../
