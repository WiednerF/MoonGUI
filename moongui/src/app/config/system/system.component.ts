import { Component } from '@angular/core';
import {MoonConnectService} from "../../services/moon-connect.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})

/**
 * Defines the view to display all information about the system
 */
export class SystemComponent {

    /**
     * The Information about the System which are usable
      * @type {any}
     */
  private sys:{arch:string,os:string,user:string,cores:number,lua:{version:string,status:boolean}}={arch:"",os:"",user:"",cores:0,lua:{version:"",status:false}};

    /**
     * Uses the Connection Service to get the Information directly from the system
     * @param moonConnect
     */
  constructor(public moonConnect:MoonConnectService) {
      Observable.timer(2000).take(1).subscribe(()=>this.getInformation(moonConnect));//Starts the Timer
  }

    /**
     * Receives the System information one time from the server
     * @param moonConnect
     */
  private getInformation(moonConnect:MoonConnectService){
      let moonConnectGet=  moonConnect.getSystemInformation();
      if(moonConnectGet!=null) {
          moonConnectGet.map(result => result.json()).subscribe(result=>this.sys = result, ()=> {
              moonConnect.addAlert("info", "Error Fetching System Information");
              Observable.timer(20000).take(1).subscribe(()=>this.getInformation(moonConnect));
          });
      }else{
          Observable.timer(2000).take(1).subscribe(()=>this.getInformation(moonConnect));
      }
  }

}
