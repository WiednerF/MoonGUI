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
export var ConfigPartComponent = (function () {
    function ConfigPartComponent() {
        this.tabs = [{ disabled: false }, {
                disabled: false }, { disabled: false }];
    }
    ConfigPartComponent.prototype.ngOnInit = function () {
    };
    ConfigPartComponent = __decorate([
        Component({
            selector: 'app-config-part',
            templateUrl: './config-part.component.html',
            styleUrls: ['./config-part.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], ConfigPartComponent);
    return ConfigPartComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/config-part/config-part.component.js.map