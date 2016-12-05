var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MoonConnectService } from "./services/moon-connect.service";
import { AlertComponent } from "./alert/alert.component";
export var AppComponent = (function () {
    /**
     * Instantiate the MoonConnect
     * @param moonConnectService
     */
    function AppComponent(moonConnectService, viewContainerRef) {
        this.moonConnectService = moonConnectService;
        /**
         * Shows the Status for the StatusBar to be able to  change it from Everywhere
         * @type {{connect: any; status: string; progressBar: {show: boolean; value: number; max: number}}}
         */
        this.status = {
            status: "",
            progressBar: { show: false, value: 50, max: 100 }
        };
        this.viewContainerRef = viewContainerRef;
    }
    /**
     * Start all parts which have to start after initiate
     */
    AppComponent.prototype.ngOnInit = function () {
        this.moonConnectService.setMainAlert(this.mainAlert);
    };
    __decorate([
        ViewChild(AlertComponent), 
        __metadata('design:type', AlertComponent)
    ], AppComponent.prototype, "mainAlert", void 0);
    AppComponent = __decorate([
        Component({
            selector: 'moon-gui',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [MoonConnectService, ViewContainerRef])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/app.component.js.map