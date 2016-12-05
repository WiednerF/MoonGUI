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
import { MoonConnectService } from "../../services/moon-connect.service";
import { Observable } from "rxjs";
export var SystemComponent = (function () {
    function SystemComponent(moonConnect) {
        var _this = this;
        this.moonConnect = moonConnect;
        this.sys = { arch: "", os: "", user: "", cores: 0, lua: { version: "", status: false } };
        Observable.timer(2000).take(1).subscribe(function () { return _this.getInformation(moonConnect); });
    }
    SystemComponent.prototype.getInformation = function (moonConnect) {
        var _this = this;
        var moonConnectGet = moonConnect.get("/rest/system/");
        if (moonConnectGet != null) {
            moonConnectGet.map(function (result) { return result.json(); }).subscribe(function (result) { return _this.sys = result; }, function () {
                moonConnect.addAlert("info", "Error Fetching System Information");
                Observable.timer(20000).take(1).subscribe(function () { return _this.getInformation(moonConnect); });
            });
        }
        else {
            Observable.timer(2000).take(1).subscribe(function () { return _this.getInformation(moonConnect); });
        }
    };
    SystemComponent = __decorate([
        Component({
            selector: 'app-system',
            templateUrl: './system.component.html',
            styleUrls: ['./system.component.css']
        }), 
        __metadata('design:paramtypes', [MoonConnectService])
    ], SystemComponent);
    return SystemComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/config/system/system.component.js.map