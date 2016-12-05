var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { MoonConnectService } from "./moon-connect.service";
//TODO From here
export var MoonConfigurationService = (function () {
    function MoonConfigurationService(connectService) {
        this.connectService = connectService;
        this.script = 0;
        this.scriptChange = new Subject();
        this.interfaceNodes = [];
        this.interfacesChange = new Subject();
        this.input = [];
        this.inputChange = new Subject();
        this.title = "";
        this.titleChange = new Subject();
        this.author = "";
        this.authorChange = new Subject();
        this.wait = new Subject();
        this.configurationHttp();
    }
    MoonConfigurationService.prototype.configurationHttp = function () {
        var _this = this;
        var configHTTP = this.connectService.get("/config/");
        if (configHTTP != null) {
            configHTTP.map(function (result) { return result.json(); }).subscribe(function (result) { return _this.writeConfiguration(result); }, function (error) {
                Observable.interval(2000).take(1).subscribe(function () { return _this.configurationHttp(); });
            });
        }
        else {
            Observable.interval(2000).take(1).subscribe(function () { return _this.configurationHttp(); });
        }
    };
    MoonConfigurationService.prototype.writeConfiguration = function (config) {
        this.configuration = config;
        this.setTitle(this.configuration[this.script].name);
        this.wait.next(true);
    };
    MoonConfigurationService.prototype.getWait = function () {
        return this.wait;
    };
    MoonConfigurationService.prototype.getConfiguration = function (id) {
        return this.configuration[id];
    };
    MoonConfigurationService.prototype.getConfigurationList = function () {
        return this.configuration;
    };
    MoonConfigurationService.prototype.getScript = function () {
        return this.script;
    };
    MoonConfigurationService.prototype.setScript = function (script) {
        this.setTitle(this.getConfigurationList()[script].name);
        this.script = script;
        this.interfaceNodes = [];
        this.input = [];
        this.scriptChange.next(script);
    };
    MoonConfigurationService.prototype.getScriptChange = function () {
        return this.scriptChange;
    };
    //************STANDARD Configuration Options
    MoonConfigurationService.prototype.getTitle = function () {
        return this.title;
    };
    MoonConfigurationService.prototype.getTitleSubscribe = function () {
        return this.titleChange;
    };
    MoonConfigurationService.prototype.setTitle = function (title) {
        this.title = title;
        this.titleChange.next(title);
    };
    MoonConfigurationService.prototype.getAuthor = function () {
        return this.author;
    };
    MoonConfigurationService.prototype.getAuthorSubscribe = function () {
        return this.authorChange;
    };
    MoonConfigurationService.prototype.setAuthor = function (author) {
        this.author = author;
        this.authorChange.next(author);
    };
    //***********Standard Values
    MoonConfigurationService.prototype.getInterface = function (id) {
        if (this.configuration[this.script].configuration.interfaces.length > id) {
            if (this.interfaceNodes[id]) {
                return this.interfaceNodes[id];
            }
            else {
                this.interfaceNodes[id] = this.configuration[this.script].configuration.interfaces[id].standard;
                return this.interfaceNodes[id];
            }
        }
    };
    MoonConfigurationService.prototype.getInterfaceChange = function () {
        return this.interfacesChange;
    };
    MoonConfigurationService.prototype.setInterface = function (id, value) {
        this.interfaceNodes[id] = value;
        this.interfacesChange.next({ id: id, value: value });
    };
    MoonConfigurationService.prototype.getInput = function (id) {
        if (this.configuration[this.script].configuration.input.length > id) {
            if (this.input[id]) {
                return this.input[id];
            }
            else {
                this.input[id] = this.configuration[this.script].configuration.input[id].standard;
                return this.input[id];
            }
        }
    };
    MoonConfigurationService.prototype.getInputChange = function () {
        return this.inputChange;
    };
    MoonConfigurationService.prototype.setInput = function (id, value) {
        this.input[id] = value;
        this.inputChange.next({ id: id, value: value });
    };
    MoonConfigurationService.prototype.getInterfaceList = function () {
        return this.connectService.get("/rest/interfaces/");
    };
    MoonConfigurationService.prototype.getJSONConfiguration = function () {
        return JSON.stringify({ title: this.title, author: this.author, script: this.script, interfaceNodes: this.interfaceNodes, input: this.input });
    };
    /**
     * Generates the Config from saved file
     * @param res Must be a correct object
     */
    MoonConfigurationService.prototype.setJSONConfiguration = function (res) {
        if (res.script) {
            this.setScript(res.script);
        }
        if (res.title) {
            this.setTitle(res.title);
        }
        if (res.author) {
            this.setAuthor(res.author);
        }
        if (res.interfaceNodes) {
            for (var i = 0; i < res.interfaceNodes.length; i++) {
                this.setInterface(i, res.interfaceNodes[i]);
            }
        }
        if (res.input) {
            for (var i = 0; i < res.input.length; i++) {
                this.setInput(i, res.input[i]);
            }
        }
    };
    MoonConfigurationService.prototype.getConfigurationObject = function () {
        var result = {};
        result.title = this.getTitle();
        result.script = this.configuration[this.getScript()].name;
        result.author = this.getAuthor();
        var conf = this.getConfiguration(this.getScript());
        if (conf.configuration) {
            if (conf.configuration.interfaces) {
                result.interfaces = {};
                for (var i = 0; i < conf.configuration.interfaces.length; i++) {
                    if (this.interfaceNodes[i]) {
                        result['interfaces'][conf.configuration.interfaces[i].conf] = this.interfaceNodes[i];
                    }
                    else {
                        result['interfaces'][conf.configuration.interfaces[i].conf] = conf.configuration.interfaces[i].standard;
                    }
                }
            }
            if (conf.configuration.input) {
                result.input = {};
                for (var i = 0; i < conf.configuration.input.length; i++) {
                    if (this.input[i]) {
                        result['input'][conf.configuration.input[i].conf] = this.input[i];
                    }
                    else {
                        result['input'][conf.configuration.input[i].conf] = conf.configuration.input[i].standard;
                    }
                }
            }
        }
        return result;
    };
    MoonConfigurationService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [MoonConnectService])
    ], MoonConfigurationService);
    return MoonConfigurationService;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/services/moon-configuration.service.js.map