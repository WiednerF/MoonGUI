import {Component, OnInit,ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {MoonConnectServiceService} from "./services/moon-connect-service.service";
import {Response} from "@angular/http";
import {MoonGenService} from "./services/moon-gen.service";
import {MainAlertComponent} from "./main-alert/main-alert.component";

@Component({
    selector: 'moon-gui',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers:[MoonConnectServiceService,MoonGenService]
})
/**
 * The Main Class Component for the Complete MoonGUI Application Frontend
 */
export class AppComponent implements OnInit{
    @ViewChild(MainAlertComponent) mainAlert:MainAlertComponent;//The Main Alert Component for Using the Alert Fields from Every Part
    /**
     * Shows the Status for the StatusBar to be able to  change it from Everywhere
     * @type {{connect: any; status: string; progressBar: {show: boolean; value: number; max: number}}}
     */
    public status: {connect: Subject<boolean>, status: string, progressBar: {show: boolean, value: number, max: number}} = {
        connect: null,
        status: "",
        progressBar: {show: false, value: 50, max: 100}
    };

    /**
     * Instantiate the MoonConnect
     * @param moonConnectService
     */
    constructor(public moonConnectService:MoonConnectServiceService) {
        this.status.connect=this.moonConnectService.getConnection();
    }

    /**
     * Start all parts which have to start after initiate
     */
    ngOnInit(){
        this.moonConnectService.setMainAlert(this.mainAlert);
    }
}
