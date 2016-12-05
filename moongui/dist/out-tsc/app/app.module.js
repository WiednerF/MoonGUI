var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { AppComponent } from './app.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { ConfigPartComponent } from './config-part/config-part.component';
import { GraphHistogramComponent } from './graph/graph-histogram/graph-histogram.component';
import { GraphLineComponent } from './graph/graph-line/graph-line.component';
import { ConfigStartComponent } from './config/config-start/config-start.component';
import { MoonConnectService } from "./services/moon-connect.service";
import { MoonGenService } from "./services/moon-gen.service";
import { AlertComponent } from './alert/alert.component';
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { SystemComponent } from './config/system/system.component';
import { MoonConfigurationService } from "./services/moon-configuration.service";
import { ConfigComponent } from './config/config/config.component';
import { NouisliderModule } from "ng2-nouislider";
import { routing } from "./app.routes";
import { Angular2DataTableModule } from "angular2-data-table";
import { MoonHistoryService } from "./services/moon-history.service";
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                StatusBarComponent,
                HeaderComponent,
                MainComponent,
                ConfigPartComponent,
                GraphHistogramComponent,
                GraphLineComponent,
                ConfigStartComponent,
                AlertComponent,
                LogViewerComponent,
                SystemComponent,
                ConfigComponent
            ],
            imports: [
                Ng2BootstrapModule,
                BrowserModule,
                FormsModule,
                HttpModule,
                PerfectScrollbarModule,
                routing,
                NouisliderModule,
                Angular2DataTableModule
            ],
            providers: [MoonConnectService, MoonGenService, MoonConfigurationService, MoonHistoryService],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/app.module.js.map