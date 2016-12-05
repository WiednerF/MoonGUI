var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
export var AlertComponent = (function () {
    function AlertComponent() {
        this.alerts = []; //All the Alert that are out on this moment
    }
    /**
     * Internal for Closing the Alerts
     * @param i
     */
    AlertComponent.prototype.closeAlert = function (i) {
        this.alerts.splice(i, 1);
    };
    /**
     * Add a new Alert to the alerts visible
     * @param type Danger, info, warning, success
     * @param content The Content to be displayed
     */
    AlertComponent.prototype.addAlert = function (type, content) {
        this.alerts.push({ type: type, content: content });
    };
    __decorate([
        Input(), 
        __metadata('design:type', Array)
    ], AlertComponent.prototype, "alerts", void 0);
    AlertComponent = __decorate([
        Component({
            selector: 'app-alert',
            templateUrl: 'alert.component.html',
            styleUrls: ['alert.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], AlertComponent);
    return AlertComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/alert/alert.component.js.map