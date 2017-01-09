# MakeFile for the basics of MoonGUI development

all: clean install build

install:
	npm install
	npm install --dev-only
	npm install angular-cli -g

build:
		ng build --prod

build-dev:
		ng build --dev

clean:
	npm cache clean
