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
import { Http } from "@angular/http";
import { Observable, Subject } from "rxjs";
/**
 * This Service is the basic Connection Service to the Backend and is based to reduce network traffic
 */
export var MoonConnectService = (function () {
    /**
     *
     * @param http Injecting the HTTP Service of Angular2 for the connections
     */
    function MoonConnectService(http) {
        this.http = http;
        this.connect = true; //The Variable for the connection
        this.connectChange = new Subject(); //Registering for changes in the connect status
        this.response = true; //If already responded to the previous request (If false, no request will be send out)
        this.testConnect(); //Start to test the connection during the running of the software
    }
    /**
     * Test if the System run if it should run
     */
    MoonConnectService.prototype.testConnect = function () {
        var _this = this;
        var obs = Observable.interval(5000);
        obs.subscribe(function () {
            if (_this.response) {
                _this.testConnectFunction();
            }
        });
        this.testConnectFunction();
    };
    /**
     * Run the test connection request
     */
    MoonConnectService.prototype.testConnectFunction = function () {
        var _this = this;
        this.response = false;
        this.http.head("/rest/").subscribe(function () {
            if (!_this.connect) {
                _this.addAlert("success", "Connection Established");
                _this.connect = true;
                _this.connectChange.next(true);
            }
            _this.response = true;
        }, function () {
            if (_this.connect) {
                _this.addAlert("danger", "Connection Lost");
                _this.connect = false;
                _this.connectChange.next(false);
            }
            _this.response = true;
        });
    };
    /**
     * The Server will be stopped (Not interrupted)
     */
    MoonConnectService.prototype.stopServer = function () {
        var _this = this;
        var delResponse = this.del("/rest/");
        if (delResponse != null) {
            delResponse.subscribe(function () {
                _this.connect = false;
                _this.connectChange.next(false);
                _this.addAlert("success", "Successfully stopped server");
            }, function (error) { return _this.addAlert("danger", "Could not stop Server:" + error); });
        }
    };
    /**
     * Set the Variable alert to the Wanted value
     * @param mainAlertVariable
     */
    MoonConnectService.prototype.setMainAlert = function (mainAlertVariable) {
        this.alert = mainAlertVariable;
    };
    /**
     * Add a temporary Alert
     * @param type The Type like warning or info
     * @param message The String Message
     */
    MoonConnectService.prototype.addAlert = function (type, message) {
        if (this.alert) {
            this.alert.addAlert(type, message);
        }
    };
    /**
     * Get the Connection HEad Message
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.getConnection = function () {
        return this.connectChange;
    };
    /**
     * Get the Starting value of the variable connect (After registering to the Subject)
     * @returns {boolean}
     */
    MoonConnectService.prototype.getConnectionStart = function () {
        return this.connect;
    };
    /**
     * The Get request
     * @param url
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.get = function (url) {
        if (this.connect) {
            return this.http.get(url);
        }
        else {
            return null;
        }
    };
    /**
     * The head request
     * @param url
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.head = function (url) {
        if (this.connect) {
            return this.http.head(url);
        }
        else {
            return null;
        }
    };
    /**
     * The Post request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.post = function (url, body) {
        if (this.connect) {
            return this.http.post(url, body);
        }
        else {
            return null;
        }
    };
    /**
     * The put request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.put = function (url, body) {
        if (this.connect) {
            return this.http.put(url, body);
        }
        else {
            return null;
        }
    };
    /**
     * The delete request
     * @param url
     * @returns {Observable<Response>}
     */
    MoonConnectService.prototype.del = function (url) {
        if (this.connect) {
            return this.http.delete(url);
        }
        else {
            return null;
        }
    };
    MoonConnectService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], MoonConnectService);
    return MoonConnectService;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/services/moon-connect.service.js.map