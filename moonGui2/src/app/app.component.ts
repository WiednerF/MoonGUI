import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {MoonConnectServiceService} from "./services/moon-connect-service.service";
import {Response} from "@angular/http";
import {MoonGenService} from "./services/moon-gen.service";
import {MainAlertComponent} from "./main-alert/main-alert.component";

@Component({
    selector: 'moon-gui',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
/**
 * The Main Class Component for the Complete MoonGUI Application Frontend
 */
export class AppComponent implements OnInit{
    @ViewChild(MainAlertComponent) mainAlert:MainAlertComponent;//The Main Alert Component for Using the Alert Fields from Every Part
    private viewContainerRef: ViewContainerRef;
    /**
     * Shows the Status for the StatusBar to be able to  change it from Everywhere
     * @type {{connect: any; status: string; progressBar: {show: boolean; value: number; max: number}}}
     */
    public status: {status: string, progressBar: {show: boolean, value: number, max: number}} = {
        status: "",
        progressBar: {show: false, value: 50, max: 100}
    };

    /**
     * Instantiate the MoonConnect
     * @param moonConnectService
     */
    constructor(public moonConnectService:MoonConnectServiceService, viewContainerRef:ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }

    /**
     * Start all parts which have to start after initiate
     */
    ngOnInit(){
        this.moonConnectService.setMainAlert(this.mainAlert);
    }
}
