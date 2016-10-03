import { Component } from '@angular/core';
import {MoonConnectServiceService} from "../../services/moon-connect-service.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent {

  private sys:{arch:string,os:string,user:string,cores:number,lua:{version:string,status:boolean}}={lua:{}};

  constructor(public moonConnect:MoonConnectServiceService) {
      Observable.timer(2000).take(1).subscribe(()=>this.getInformation(moonConnect));
  }
  getInformation(moonConnect:MoonConnectServiceService){
      moonConnect.get("/rest/system/").map(result => result.json()).subscribe(result=>this.sys=result,()=>{moonConnect.addAlert("info","Error Fetching System Information");Observable.timer(20000).take(1).subscribe(()=>this.getInformation(moonConnect));});

  }

}
