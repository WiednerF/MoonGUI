import { Injectable } from '@angular/core';
import {MoonConnectServiceService} from "./moon-connect-service.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class MoonGenService {

  private executionNumber:number;
  private shouldRun:boolean=false;
  private running:boolean=false;

  constructor(private moonConnectService:MoonConnectServiceService) {
      var obs=Observable.interval(1000);
      obs.subscribe(()=>{
        this.running = this.shouldRun != false;//TODO Routine for checking connect
      })
  }

  public startMoonGen(responseFunction:any,object:any):void{
      if(this.shouldRun) return null;
      this.moonConnectService.put("/rest/moongen/",{test:"test"}).subscribe((response)=>{this.shouldRun=true;this.executionNumber=response.json().execution;responseFunction(response,false,object);},error=>{this.shouldRun=false;responseFunction(error,true,object);});
  }

  public stopMoonGen(responseFunction:any,object:any):void{
      if(!this.shouldRun) return null;
      this.moonConnectService.del("/rest/moongen/"+this.executionNumber+"/").subscribe(()=>{this.shouldRun=false;this.executionNumber=null;responseFunction(null,false,object);},()=>{this.shouldRun=true;responseFunction(null,true,object)});
  }

    /**
     * Get if the thing is running
     * @returns {boolean}
     */
  public getRunning():boolean{
      return this.running;
    }

}
