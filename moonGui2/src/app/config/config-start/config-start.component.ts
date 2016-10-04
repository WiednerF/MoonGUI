import {Component, OnInit} from '@angular/core';
import {MoonGenService} from "../../services/moon-gen.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-config-start',
  templateUrl: './config-start.component.html',
  styleUrls: ['./config-start.component.css']
})
export class ConfigStartComponent implements OnInit {
  status = 0;
  private title:string;

  constructor(public moonGenService:MoonGenService) {
  }

  ngOnInit() {
      this.moonGenService.getTitle().subscribe((value)=>{this.title=value});
      this.moonGenService.getRunningSubscribe().subscribe(value=>{if(value){this.status=1;}else{this.status=0;}})
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

    /**
     * Change the Title of the Component
     */
    public changeTitle($event){
        this.moonGenService.setTitle($event.target.value);
    }

}
