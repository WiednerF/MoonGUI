import { Injectable } from '@angular/core';
import {MoonConnectServiceService} from "./moon-connect-service.service";
import {Observable, Subject} from "rxjs";
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
    private runningChange:Subject<boolean>=new Subject<boolean>();
    /**
     * The actual part of the file which should be send
     * @type {number}
     */
  private logLineNumber:number=0;

    private title:string="";
    private titleChange: Subject<string> = new Subject<string>();

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
          var running=this.running;
          this.running = this.shouldRun != false;//TODO Routine for checking connect
          if(this.running!=running){
              this.runningChange.next(this.running);
          }
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
      this.moonConnectService.post("/rest/moongen/",{test:"test"}).subscribe((response)=>{this.shouldRun=true;this.logLineNumber=0;this.executionNumber=response.json().execution;responseFunction(response,false,object);},error=>{this.shouldRun=false;this.moonConnectService.addAlert("danger","MoonGen Start not working:"+error);responseFunction(error,true,object);});
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

    public getLogFile(){
        if(!this.shouldRun&&this.logLineNumber==0) return null;
        return this.moonConnectService.get("/rest/moongen/"+this.executionNumber+"/log/?lines="+this.logLineNumber);
    }

    public setTitle(title:string):void{
        this.title=title;//TODO With Server
        this.titleChange.next(this.title);
    }

    public getTitle():Subject<string>{
        return this.titleChange;//TODO With Server
    }

}
