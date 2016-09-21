import { Component, OnInit } from '@angular/core';
import {MoonGenService} from "../../services/moon-gen.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-config-start',
  templateUrl: './config-start.component.html',
  styleUrls: ['./config-start.component.css']
})
export class ConfigStartComponent implements OnInit {
  status = 0;

  constructor(public moonGenService:MoonGenService) { }

  ngOnInit() {
  }

  startMoonGen(){
      this.moonGenService.startMoonGen(ConfigStartComponent.startMoonGenResult,this);
  }

  public static startMoonGenResult(result:Response, error:boolean, component:ConfigStartComponent){
        if(error){
            console.log("Test"+result);
            component.status=0;
        }
  }

  stopMoonGen(){
    this.moonGenService.stopMoonGen(ConfigStartComponent.stopMoonGenResult,this);
  }

    public static stopMoonGenResult(result:Response, error:boolean, component:ConfigStartComponent){
        if(error){
            component.status=1;
        }
    }

}
