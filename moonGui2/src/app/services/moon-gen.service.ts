import { Injectable } from '@angular/core';
import {MoonConnectServiceService} from "./moon-connect-service.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
/**
 * This is the MoonGen Class for the Complete API Behind the point /rest/moongen
 */
@Injectable()
export class MoonGenService {
    /**
     * The ExecutionNumber for representing the connection
     */
    private executionNumber:number;
    /**
     * If the MoonGen Should run (For Connection Test)
     * @type {boolean}
     */
  private shouldRun:boolean=false;
    /**
     * If moonGen is really running
     * @type {boolean}
     */
  private running:boolean=false;

    /**
     * Needs the Connection Service for accessing the Connection
      * @param moonConnectService
     */
  constructor(private moonConnectService:MoonConnectServiceService) {
      this.testRunning();
  }

    /**
     * Test if the System run if it should run
     */
  private testRunning(){
      var obs=Observable.interval(1000);
      obs.subscribe(()=>{
          this.running = this.shouldRun != false;//TODO Routine for checking connect
      })
  }

    /**
     * Starting MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
  public startMoonGen(responseFunction:any,object:any):void{
      if(this.shouldRun) return null;
      this.moonConnectService.post("/rest/moongen/",{test:"test"}).subscribe((response)=>{this.shouldRun=true;this.executionNumber=response.json().execution;responseFunction(response,false,object);},error=>{this.shouldRun=false;this.moonConnectService.addAlert("danger","MoonGen Start not working:"+error);responseFunction(error,true,object);});
  }

    /**
     * Stopping MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
  public stopMoonGen(responseFunction:any,object:any):void{
      if(!this.shouldRun) return null;
      this.moonConnectService.del("/rest/moongen/"+this.executionNumber+"/").subscribe(()=>{this.shouldRun=false;this.executionNumber=null;responseFunction(null,false,object);},(error)=>{this.shouldRun=true;this.moonConnectService.addAlert("danger","MoonGen Stop not working:"+error);responseFunction(null,true,object)});
  }

    /**
     * Get if the thing is running
     * @returns {boolean}
     */
  public getRunning():boolean{
      return this.running;
    }

}
