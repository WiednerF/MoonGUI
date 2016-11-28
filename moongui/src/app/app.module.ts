import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Ng2BootstrapModule} from 'ng2-bootstrap'
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar'
import { AppComponent } from './app.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { ConfigPartComponent } from './config-part/config-part.component';
import { GraphHistogramComponent } from './graph/graph-histogram/graph-histogram.component';
import { GraphLineComponent } from './graph/graph-line/graph-line.component';
import { ConfigStartComponent } from './config/config-start/config-start.component';
import {MoonConnectServiceService} from "./services/moon-connect-service.service";
import {MoonGenService} from "./services/moon-gen.service";
import { AlertComponent } from './alert/alert.component';
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { SystemComponent } from './config/system/system.component';
import {MoonConfigurationService} from "./services/moon-configuration.service";
import { ConfigComponent } from './config/config/config.component';
import {NouisliderModule} from "ng2-nouislider";
import {routing} from "./app.routes";
import {Angular2DataTableModule} from "angular2-data-table";
import {MoonHistoryService} from "./services/moon-history.service";

@NgModule({
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
  providers: [MoonConnectServiceService,MoonGenService, MoonConfigurationService, MoonHistoryService],
  bootstrap: [AppComponent]
})
/**
 * The Main Class for the MoonGUI Application
 */
export class AppModule {}
