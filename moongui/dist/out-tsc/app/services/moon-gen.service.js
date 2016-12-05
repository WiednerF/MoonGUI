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
import { MoonConnectService } from "./moon-connect.service";
import { Observable, Subject } from "rxjs";
import { MoonConfigurationService } from "./moon-configuration.service";
/**
 * This is the MoonGen Class for the Complete API Behind the API endpoint /rest/moongen
 */
export var MoonGenService = (function () {
    /**
     * Needs the Connection Service for accessing the Connection
     * @param moonConnectService The connection service for handling network connections
     * @param configurationService The configuration service for moongen
     */
    function MoonGenService(moonConnectService, configurationService) {
        this.moonConnectService = moonConnectService;
        this.configurationService = configurationService;
        /**
         * If the MoonGen Should run (For Connection Test)
         * @type {boolean}
         */
        this.shouldRun = false;
        /**
         * If the response of the last request already was here
         * @type {boolean}
         */
        this.response = true;
        /**
         * If moonGen is really running
         * @type {boolean}
         */
        this.running = false;
        this.runningChange = new Subject();
        this.subscribe = null; //The Subscriper to the running process
        this.interval = Observable.interval(10000); //Starting the Interval Observable
    }
    /**
     * Starts the Test if the System is running and returns the Subscription
     */
    MoonGenService.prototype.subscribeTestRunning = function () {
        var _this = this;
        return this.interval.subscribe(function () {
            if (_this.response) {
                _this.response = false;
                var runTestHTTP = _this.moonConnectService.head("/rest/moongen/" + _this.executionNumber + "/");
                if (runTestHTTP != null) {
                    runTestHTTP.subscribe(function () {
                        _this.response = true;
                        if (!_this.running) {
                            _this.running = true;
                            _this.runningChange.next(true);
                        }
                    }, function () {
                        if (_this.running) {
                            _this.running = false;
                            _this.runningChange.next(false);
                            _this.moonConnectService.addAlert("danger", "MoonGen stopped");
                        }
                        _this.response = true;
                    });
                }
                else {
                    _this.running = false;
                    _this.runningChange.next(false);
                    _this.response = true;
                }
            }
        });
    };
    /**
     * Starting MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     */
    MoonGenService.prototype.startMoonGen = function (responseFunction, object) {
        var _this = this;
        if (!this.shouldRun) {
            var startHTTP = this.moonConnectService.post("/rest/moongen/", this.configurationService.getConfigurationObject());
            if (startHTTP != null) {
                startHTTP.subscribe(function (response) {
                    _this.shouldRun = true;
                    _this.executionNumber = response.json().execution;
                    _this.running = true; //Removes the running dependencies
                    _this.runningChange.next(true);
                    _this.subscribe = _this.subscribeTestRunning();
                    responseFunction(false, object); //Gives the result back to the consumer
                }, function (error) {
                    _this.shouldRun = false;
                    _this.moonConnectService.addAlert("danger", "MoonGen not started: " + error);
                    responseFunction(true, object); //Gives the result back to the consumer
                });
            }
        }
    };
    /**
     * Stopping MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
    MoonGenService.prototype.stopMoonGen = function (responseFunction, object) {
        var _this = this;
        if (this.shouldRun) {
            var stopHTTP = this.moonConnectService.del("/rest/moongen/" + this.executionNumber + "/");
            if (stopHTTP != null) {
                stopHTTP.subscribe(function () {
                    _this.shouldRun = false;
                    _this.executionNumber = null;
                    _this.running = false; //Removes the running dependencies
                    _this.runningChange.next(false);
                    if (_this.subscribe != null) {
                        _this.subscribe.unsubscribe();
                        _this.subscribe = null;
                    }
                    responseFunction(false, object);
                }, function (error) {
                    _this.shouldRun = true;
                    _this.moonConnectService.addAlert("danger", "MoonGen is not stopped:" + error);
                    responseFunction(true, object);
                });
            }
        }
    };
    /**
     * Get if the thing is running
     * @returns {boolean}
     */
    MoonGenService.prototype.getShouldRun = function () {
        return this.shouldRun;
    };
    /**
     * Get if the software is running
     * @returns {boolean}
     */
    MoonGenService.prototype.getRunningSubscribe = function () {
        return this.runningChange;
    };
    /**
     * The ExecutionNumber for checking the Execution
     * @returns {number}
     */
    MoonGenService.prototype.getExecutionNumber = function () {
        return this.executionNumber;
    };
    /**
     * Returns the subscriber for the LogFile
     * @param seek Where in the LogFile the next part should be
     * @returns {Observable<Response>}
     */
    MoonGenService.prototype.getLogFile = function (seek) {
        if (!this.shouldRun)
            return null;
        return this.moonConnectService.get("/rest/moongen/" + this.executionNumber + "/log/?seek=" + seek);
    };
    /**
     * Returns the subscriber for the data connection
     * @returns {Observable<Response>}
     */
    MoonGenService.prototype.getData = function (count) {
        if (!this.shouldRun)
            return null;
        return this.moonConnectService.get("/rest/moongen/" + this.executionNumber + "/?count=" + count);
    };
    MoonGenService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [MoonConnectService, MoonConfigurationService])
    ], MoonGenService);
    return MoonGenService;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/services/moon-gen.service.js.map