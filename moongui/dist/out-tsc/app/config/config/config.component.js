var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { MoonConfigurationService } from "../../services/moon-configuration.service";
import { Observable } from "rxjs";
export var ConfigComponent = (function () {
    function ConfigComponent(configuration) {
        var _this = this;
        this.configuration = configuration;
        this.configurationObject = { name: "moongen-server.lua",
            configuration: {
                interfaces: [
                    {
                        standard: 0,
                        name: "TX Interface",
                        conf: "tx"
                    },
                    {
                        standard: 1,
                        name: "RX Interface",
                        conf: "rx"
                    }
                ],
                input: [
                    {
                        standard: 10,
                        type: "range",
                        name: "PacketNumber in 10^",
                        unit: "10^",
                        conf: "pktNr",
                        max: 100,
                        min: 1,
                        step: 1
                    }
                ]
            }
        };
        this.interfaceList = [];
        this.interfaceNode = [];
        this.input = [];
        this.configuration.getWait().subscribe(function (value) {
            if (value) {
                var configurationObject = _this.configuration.getConfiguration(_this.configuration.getScript());
                _this.initScript(configurationObject);
                _this.configurationObject = configurationObject;
                _this.configuration.getScriptChange().subscribe(function () { var configurationObject = _this.configuration.getConfiguration(_this.configuration.getScript()); _this.initScript(configurationObject); _this.configurationObject = configurationObject; });
                _this.configuration.getInterfaceChange().subscribe(function (value) { _this.interfaceNode[value.id] = value.value; });
                _this.configuration.getInputChange().subscribe(function (value) { _this.input[value.id] = value.value; });
            }
        });
    }
    ConfigComponent.prototype.initScript = function (configurationObject) {
        if (configurationObject.configuration) {
            if (configurationObject.configuration.interfaces) {
                this.interfaceNode = [];
                for (var i = 0; i < configurationObject.configuration.interfaces.length; i++) {
                    this.interfaceNode.push(this.configuration.getInterface(i));
                }
            }
            if (configurationObject.configuration.input) {
                this.input = [];
                for (var i = 0; i < configurationObject.configuration.input.length; i++) {
                    this.input.push(this.configuration.getInput(i));
                }
            }
        }
    };
    ConfigComponent.prototype.ngOnInit = function () {
        this.getInterfaceList();
    };
    /**
     * Changes the Interface configuration
     * @param $event
     * @param id
     */
    ConfigComponent.prototype.changeInterface = function ($event, id) {
        this.configuration.setInterface(id, $event);
        this.interfaceNode[id] = $event;
    };
    /**
     * Changes the Input configuration
     * @param $event
     * @param id
     */
    ConfigComponent.prototype.changeInput = function ($event, id) {
        this.configuration.setInput(id, $event);
        this.input[id] = $event;
    };
    ConfigComponent.prototype.getInterfaceList = function () {
        var _this = this;
        this.getInterfaceListHTTP();
        Observable.interval(100000).subscribe(function () {
            _this.getInterfaceListHTTP();
        });
    };
    ConfigComponent.prototype.getInterfaceListHTTP = function () {
        var _this = this;
        var interfaceListHTTP = this.configuration.getInterfaceList();
        if (interfaceListHTTP != null) {
            this.configuration.getInterfaceList().map(function (response) { return response.json(); }).subscribe(function (response) {
                _this.interfaceList = response;
            }, function (error) { return console.log("Error: " + error); });
        }
    };
    ConfigComponent.prototype.getProp = function (name, id) {
        return this[name][id];
    };
    ConfigComponent = __decorate([
        Component({
            selector: 'app-config',
            templateUrl: './config.component.html',
            styleUrls: ['./config.component.css']
        }), 
        __metadata('design:paramtypes', [MoonConfigurationService])
    ], ConfigComponent);
    return ConfigComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/config/config/config.component.js.map