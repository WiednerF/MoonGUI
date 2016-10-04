import { Injectable } from '@angular/core';
import {MoonConnectServiceService} from "./moon-connect-service.service";
import {Observable, Subject} from "rxjs";
import {MoonConfigurationService} from "./moon-configuration.service";
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
    private response:boolean=true;
    /**
     * If moonGen is really running
     * @type {boolean}
     */
  private running:boolean=false;
    private runningChange:Subject<boolean>=new Subject<boolean>();

    /**
     * Needs the Connection Service for accessing the Connection
     * @param moonConnectService
     * @param configurationService
     */
  constructor(private moonConnectService:MoonConnectServiceService, private configurationService:MoonConfigurationService) {
      this.testRunning();
  }

    /**
     * Test if the System run if it should run
     */
  private testRunning(){
      var obs=Observable.interval(10000);
      obs.subscribe(()=>{
          var running=this.running;
          if(this.response) {
              if (this.shouldRun) {
                  this.response=false;
                  this.moonConnectService.head("/rest/moongen/" + this.executionNumber + "/").subscribe((response)=>{this.response=true;this.resultRunning(true, running)}, (error)=> {
                      if (running) {
                          this.moonConnectService.addAlert("danger", "MoonGen stopped")
                      }
                      this.response=true;
                      this.resultRunning(false, running);
                  });
                  this.running = true;
              } else {
                  this.resultRunning(false, this.running);
              }
          }
      })
  }

  private resultRunning(running:boolean,previous:boolean){
      this.running=running;
      if (running != previous) {
          this.runningChange.next(this.running);
      }
  }

    /**
     * Starting MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
  public startMoonGen(responseFunction:any,object:any):void{
      if(this.shouldRun) return null;
      this.moonConnectService.post("/rest/moongen/",this.configurationService.getConfigurationObject()).subscribe((response)=>{this.shouldRun=true;this.executionNumber=response.json().execution;responseFunction(response,false,object);},error=>{this.shouldRun=false;this.moonConnectService.addAlert("danger","MoonGen Start not working:"+error);responseFunction(error,true,object);});
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
  public getShouldRun():boolean{
      return this.shouldRun;
    }

    /**
     * Get if the thing is running
     * @returns {boolean}
     */
    public getRunningSubscribe():Subject<boolean>{
        return this.runningChange;
    }

    /**
     * The ExecutionNumber for checking the Execution
     * @returns {number}
     */
   public getExecutionNumber(){
       return this.executionNumber;
   }

    public getLogFile(seek:number){
        if(!this.shouldRun) return null;
        return this.moonConnectService.get("/rest/moongen/"+this.executionNumber+"/log/?seek="+seek);
    }

    public getData(seek:number){
        if(!this.shouldRun) return null;
        return this.moonConnectService.get("/rest/moongen/"+this.executionNumber+"/?seek="+seek);
    }

    public setTitle(title:string):void{
        this.configurationService.setTitle(title);
    }

    public getTitle():Subject<string>{
        return this.configurationService.getTitleSubscribe();
    }

}
