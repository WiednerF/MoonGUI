import { Component, OnInit , Input, OnChanges } from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonGenService} from "../services/moon-gen.service";

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit,OnChanges {
    @Input() public connect: Observable<Response> = null;
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
              () => this.connectStatus=true,
              (response) => this.connectStatus=false,
              () => console.log('Completed!')
          );
      }
  }

}
