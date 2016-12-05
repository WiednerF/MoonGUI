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
import { MoonConfigurationService } from "../services/moon-configuration.service";
export var HeaderComponent = (function () {
    function HeaderComponent(moonConfig) {
        this.moonConfig = moonConfig;
        this.title = ""; //The Title
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.moonConfig.getTitleSubscribe().subscribe(function (value) { _this.title = value; document.title = _this.title != "" ? "MoonGen - " + _this.title : "MoonGen"; });
    };
    HeaderComponent = __decorate([
        Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css']
        }), 
        __metadata('design:paramtypes', [MoonConfigurationService])
    ], HeaderComponent);
    return HeaderComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/header/header.component.js.map