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
import { MoonGenService } from "../services/moon-gen.service";
import { Observable } from "rxjs";
import { MoonConnectService } from "../services/moon-connect.service";
export var LogViewerComponent = (function () {
    function LogViewerComponent(moonGenService, connectService) {
        this.moonGenService = moonGenService;
        this.connectService = connectService;
        this.executionNumber = -1;
        this.response = true;
        this.log = [];
        this.seek = 0;
    }
    LogViewerComponent.prototype.ngOnInit = function () {
        this.runningLogFile();
    };
    /**
     * Starts the Process for Fetching Log File
     */
    LogViewerComponent.prototype.runningLogFile = function () {
        var _this = this;
        Observable.interval(3000).subscribe(function () {
            if (_this.moonGenService.getShouldRun() == true) {
                if (_this.executionNumber != _this.moonGenService.getExecutionNumber()) {
                    _this.executionNumber = _this.moonGenService.getExecutionNumber();
                    if (_this.executionNumber != null) {
                        _this.initiateLog();
                        _this.response = true;
                    }
                }
                if (_this.response) {
                    _this.getLog();
                }
            }
        });
    };
    /**
     * Get the Log from external
     */
    LogViewerComponent.prototype.getLog = function () {
        var _this = this;
        var logFile = this.moonGenService.getLogFile(this.seek);
        this.response = false;
        if (logFile != null) {
            logFile.timeout(30000, new Error("Timeout exceeded")).map(function (response) { return response.json(); }).subscribe(function (response) {
                _this.seek = response.seek;
                _this.response = true;
                var result = response.log;
                for (var i = 0; i < result.length; i++) {
                    _this.log.push(decodeURIComponent(result[i]));
                }
                if (result.length > 0) {
                    var elem = document.getElementsByClassName("flex-log")[0];
                    elem.scrollTop = elem.scrollHeight;
                }
            }, function (error) {
                _this.connectService.addAlert("danger", "Log File Error: " + error);
                _this.response = true;
            });
        }
    };
    /**
     * Initiate the DOM for the Log
     */
    LogViewerComponent.prototype.initiateLog = function () {
        this.log = [];
        this.seek = 0;
    };
    LogViewerComponent = __decorate([
        Component({
            selector: 'app-log-viewer',
            templateUrl: './log-viewer.component.html',
            styleUrls: ['./log-viewer.component.css']
        }), 
        __metadata('design:paramtypes', [MoonGenService, MoonConnectService])
    ], LogViewerComponent);
    return LogViewerComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/log-viewer/log-viewer.component.js.map