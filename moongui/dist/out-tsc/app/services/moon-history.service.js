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
/**
 * This Service connects the frontend representation with the history API
 */
export var MoonHistoryService = (function () {
    /**
     *
     * @param moonConnect The Connection Service to the Server
     */
    function MoonHistoryService(moonConnect) {
        this.moonConnect = moonConnect;
    }
    /**
     * This methods clears all data previously stored in the history folder on the server
     */
    MoonHistoryService.prototype.clearAll = function () {
        var _this = this;
        var del = this.moonConnect.del("/rest/history/"); //The request is started
        if (del != null) {
            del.subscribe(function () {
                _this.moonConnect.addAlert("success", "Successfully deleted all history files");
            }, function (error) {
                _this.moonConnect.addAlert("danger", "Error in Deleting history files: " + error);
            });
        }
    };
    MoonHistoryService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [MoonConnectService])
    ], MoonHistoryService);
    return MoonHistoryService;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/services/moon-history.service.js.map