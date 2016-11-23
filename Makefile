# MakeFile for the basics of MoonGUI development

all: clean install build

install:
	git submodule update --init
	cd ../ && ./build.sh
	luarocks install turbo
	luarocks install luasocket
	cd moongui && make install

build:
		cd moongui && $(MAKE) build

build-dev:
		cd moongui && $(MAKE) build-dev
clean:
		cd moongui && $(MAKE) clean
