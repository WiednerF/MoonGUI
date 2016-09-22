import { Component, OnInit , Input, OnChanges } from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonGenService} from "../services/moon-gen.service";
import {MainAlertComponent} from "../main-alert/main-alert.component";

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit,OnChanges {
    @Input() public connect: Observable<Response> = null;
    @Input() public alert:MainAlertComponent;
    private running: boolean = false;
    @Input() public status: string = "";
    @Input() public progressBar: {show : boolean, max: number, value: number};
    private connectStatus=false;

  constructor(public moonGenService:MoonGenService) {

  }

  ngOnInit() {
        var obs=Observable.interval(1000);//Check the running state
        obs.subscribe(()=>{
           this.running=this.moonGenService.getRunning();
        });
  }

  ngOnChanges(changes){
      if(changes.connect){
          changes.connect.currentValue.subscribe(
              () => {if(!this.connectStatus){this.alert.addAlert("success","Connection Established") }this.connectStatus=true;},
              (response) =>{ if(this.connectStatus){this.alert.addAlert("danger",response)} this.connectStatus=false}
          );
      }
  }

}
