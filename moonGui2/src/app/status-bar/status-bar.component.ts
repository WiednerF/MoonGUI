import { Component, OnInit , Input, OnChanges } from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonGenService} from "../services/moon-gen.service";
import {MainAlertComponent} from "../main-alert/main-alert.component";
import {MoonConnectServiceService} from "../services/moon-connect-service.service";

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
/**
 * The Class is for Displaying the Status bar in the footer
 */
export class StatusBarComponent implements OnInit,OnChanges {
    /**
     * The Connection Responsible for Checking
     * @type {any}
     */
    @Input() public connect: Observable<Response> = null;
    private running: boolean = false;//To show running of the Code
    @Input() public status: string = "";//To Show a status string
    @Input() public progressBar: {show : boolean, max: number, value: number};//To show the progressbar with options
    private connectStatus=false;//The connectStatus for template variables

    /**
     * Instantiate of the Status bar
     * @param moonGenService The MoonGenAPI Service
     * @param connectService The Connection Service
     */
  constructor(public moonGenService:MoonGenService,public connectService:MoonConnectServiceService) {

  }

  ngOnInit() {//Check the Sunning Syste,
        var obs=Observable.interval(1000);//Check the running state
        obs.subscribe(()=>{
           this.running=this.moonGenService.getRunning();
        });
  }

  ngOnChanges(changes){
      if(changes.connect){
          changes.connect.currentValue.subscribe(
              () => {if(!this.connectStatus){this.connectService.addAlert("success","Connection Established") }this.connectStatus=true;},
              (response) =>{ if(this.connectStatus){this.connectService.addAlert("danger",response)} this.connectStatus=false}
          );
      }
  }

}
