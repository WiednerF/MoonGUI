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
import { MoonGenService } from "../services/moon-gen.service";
import { MoonConnectService } from "../services/moon-connect.service";
export var StatusBarComponent = (function () {
    /**
     * Instantiate of the Status bar
     * @param moonGenService The MoonGenAPI Service
     * @param connectService The Connection Service
     */
    function StatusBarComponent(moonGenService, connectService) {
        this.moonGenService = moonGenService;
        this.connectService = connectService;
        /**
         * The Connection Responsible for Checking
         * @type {any}
         */
        this.running = false; //To show running of the Code
        this.status = ""; //To Show a status string
        this.connectStatus = false; //The connectStatus for template variables
    }
    StatusBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.moonGenService.getRunningSubscribe().subscribe(function (value) { return _this.running = value; });
        this.connectService.getConnection().subscribe(function (value) { return _this.connectStatus = value; });
        this.connectStatus = this.connectService.getConnectionStart();
    };
    __decorate([
        //To show running of the Code
        Input(), 
        __metadata('design:type', String)
    ], StatusBarComponent.prototype, "status", void 0);
    __decorate([
        //To Show a status string
        Input(), 
        __metadata('design:type', Object)
    ], StatusBarComponent.prototype, "progressBar", void 0);
    StatusBarComponent = __decorate([
        Component({
            selector: 'app-status-bar',
            templateUrl: './status-bar.component.html',
            styleUrls: ['./status-bar.component.css']
        }), 
        __metadata('design:paramtypes', [MoonGenService, MoonConnectService])
    ], StatusBarComponent);
    return StatusBarComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/status-bar/status-bar.component.js.map