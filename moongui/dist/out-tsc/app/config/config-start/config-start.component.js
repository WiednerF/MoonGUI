var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { MoonGenService } from "../../services/moon-gen.service";
import { MoonConfigurationService } from "../../services/moon-configuration.service";
import { MoonHistoryService } from "../../services/moon-history.service";
import { ModalDirective } from "ng2-bootstrap";
import { MoonConnectService } from "../../services/moon-connect.service";
export var ConfigStartComponent = (function () {
    function ConfigStartComponent(configurationService, moonGenService, moonHistory, connect) {
        var _this = this;
        this.configurationService = configurationService;
        this.moonGenService = moonGenService;
        this.moonHistory = moonHistory;
        this.connect = connect;
        this.status = 0;
        this.clearAllValues = true;
        this.save = true;
        this.load = true;
        this.stopServerValue = true;
        this.fileInformation = [];
        this.configurationService.getWait().subscribe(function (value) {
            if (value) {
                _this.configurationList = _this.configurationService.getConfigurationList();
                _this.script = _this.configurationService.getScript();
                _this.title = _this.configurationService.getTitle();
                _this.author = _this.configurationService.getAuthor();
            }
        });
    }
    ConfigStartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.configurationService.getTitleSubscribe().subscribe(function (value) {
            _this.title = value;
        });
        this.configurationService.getAuthorSubscribe().subscribe(function (value) {
            _this.author = value;
        });
        this.moonGenService.getRunningSubscribe().subscribe(function (value) {
            if (value) {
                _this.status = 1;
            }
            else {
                _this.status = 0;
            }
        });
        this.configurationService.getScriptChange().subscribe(function (value) {
            _this.script = value;
        });
    };
    ConfigStartComponent.prototype.startMoonGen = function () {
        this.moonGenService.startMoonGen(ConfigStartComponent.startMoonGenResult, this);
    };
    ConfigStartComponent.startMoonGenResult = function (error, component) {
        if (error) {
            component.status = 0;
        }
    };
    ConfigStartComponent.prototype.stopMoonGen = function () {
        this.moonGenService.stopMoonGen(ConfigStartComponent.stopMoonGenResult, this);
    };
    ConfigStartComponent.stopMoonGenResult = function (error, component) {
        if (error) {
            component.status = 1;
        }
    };
    /**
     * Change the Title of the Component
     */
    ConfigStartComponent.prototype.changeTitle = function ($event) {
        this.configurationService.setTitle($event.target.value);
    };
    /**
     * Change the Author of the Component
     */
    ConfigStartComponent.prototype.changeAuthor = function ($event) {
        this.configurationService.setAuthor($event.target.value);
    };
    /**
     * Change the Script of the Component
     */
    ConfigStartComponent.prototype.changeScript = function ($event) {
        this.configurationService.setScript($event);
    };
    ConfigStartComponent.prototype.clearAll = function () {
        this.moonHistory.clearAll();
        this.clearAllValues = true;
    };
    ConfigStartComponent.prototype.stopServer = function () {
        this.connect.stopServer();
        this.stopServerValue = true;
    };
    ConfigStartComponent.prototype.saveFile = function () {
        var content = this.configurationService.getJSONConfiguration();
        ConfigStartComponent.download("moonGUI.json", content);
        this.save = true;
    };
    ConfigStartComponent.prototype.loadFile = function () {
        this.loadFileModal.show();
        this.load = true;
    };
    ConfigStartComponent.prototype.loadNewConfiguration = function (event) {
        this.loadFileModal.hide();
        this.readThis(event.target);
    };
    /**
     * Reads a loaded file content
     * @param inputValue
     */
    ConfigStartComponent.prototype.readThis = function (inputValue) {
        var file = inputValue.files[0];
        var myReader = new FileReader();
        var config = this.configurationService;
        myReader.onloadend = function (e) {
            var result = JSON.parse(myReader.result);
            config.setJSONConfiguration(result);
        };
        myReader.readAsText(file);
    };
    ConfigStartComponent.prototype.getProbDescription = function (script) {
        return this.configurationList[script].description;
    };
    /**
     * Downloads the File to save
     * @param filename The Filename
     * @param text the content
     */
    ConfigStartComponent.download = function (filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        if (document.createEvent) {
            var event_1 = document.createEvent('MouseEvents');
            event_1.initEvent('click', true, true);
            pom.dispatchEvent(event_1);
        }
        else {
            pom.click();
        }
    };
    __decorate([
        ViewChild('loadFileModal'), 
        __metadata('design:type', ModalDirective)
    ], ConfigStartComponent.prototype, "loadFileModal", void 0);
    ConfigStartComponent = __decorate([
        Component({
            selector: 'app-config-start',
            templateUrl: './config-start.component.html',
            styleUrls: ['./config-start.component.css']
        }), 
        __metadata('design:paramtypes', [MoonConfigurationService, MoonGenService, MoonHistoryService, MoonConnectService])
    ], ConfigStartComponent);
    return ConfigStartComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/config/config-start/config-start.component.js.map