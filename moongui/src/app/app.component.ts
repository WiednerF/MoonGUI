import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MoonConnectService} from "./services/moon-connect.service";
import {AlertComponent} from "./alert/alert.component";

@Component({
    selector: 'moon-gui',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
/**
 * The Main Class Component for the Complete MoonGUI Application Frontend
 */
export class AppComponent implements OnInit{
    @ViewChild(AlertComponent) mainAlert:AlertComponent;//The Main Alert Component for Using the Alert Fields from Every Part
    private viewContainerRef: ViewContainerRef;
    /**
     * Shows the Status for the StatusBar to be able to  change it from Everywhere
     * @type {any}
     */
    public status: {status: string, progressBar: {show: boolean, value: number, max: number}} = {
        status: "",
        progressBar: {show: false, value: 50, max: 100}
    };

    /**
     * Instantiate the MoonConnect
     * @param moonConnectService The MoonGen Service handling connections
     * @param viewContainerRef  The Container Reference for the modal view
     */
    constructor(public moonConnectService:MoonConnectService, viewContainerRef:ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }

    /**
     * Start all parts which have to start after initiate
     */
    ngOnInit(){
        this.moonConnectService.setMainAlert(this.mainAlert);
    }
}
