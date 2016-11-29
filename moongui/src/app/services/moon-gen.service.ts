import { Injectable } from '@angular/core';
import {MoonConnectService} from "./moon-connect.service";
import {Observable, Subject} from "rxjs";
import {MoonConfigurationService} from "./moon-configuration.service";
import {Response} from "@angular/http";
/**
 * This is the MoonGen Class for the Complete API Behind the API endpoint /rest/moongen
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
     * If the response of the last request already was here
     * @type {boolean}
     */
    private response:boolean=true;
    /**
     * If moonGen is really running
     * @type {boolean}
     */
  private running:boolean=false;
  private runningChange:Subject<boolean>=new Subject<boolean>();

    /**
     * The interval generator for the subscribeTestRunning
     */
  private interval;

  private subscribe=null;//The Subscriper to the running process

    /**
     * Needs the Connection Service for accessing the Connection
     * @param moonConnectService The connection service for handling network connections
     * @param configurationService The configuration service for moongen
     */
  constructor(private moonConnectService:MoonConnectService, private configurationService:MoonConfigurationService) {
      this.interval = Observable.interval(10000);//Starting the Interval Observable
  }

    /**
     * Starts the Test if the System is running and returns the Subscription
     */
  private subscribeTestRunning(){
      return this.interval.subscribe(()=>{
          if(this.response) {
                  this.response=false;
                  let runTestHTTP:Observable<Response>=this.moonConnectService.head("/rest/moongen/" + this.executionNumber + "/");
                  if(runTestHTTP!=null) {
                      runTestHTTP.subscribe(()=> {//Success
                          this.response = true;
                          if(!this.running){//Change only if there was a change
                              this.running=true;
                              this.runningChange.next(true);
                          }
                      }, ()=> {//Error
                          if (this.running) {//Change only if there was a change
                              this.running=false;
                              this.runningChange.next(false);
                              this.moonConnectService.addAlert("danger", "MoonGen stopped")
                          }
                          this.response = true;
                      });
                  }else{//Change if there is no connection to the server
                      this.running=false;
                      this.runningChange.next(false);
                      this.response=true;
                  }
              }
      })
  }

    //TODO From here

    /**
     * Starting MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
  public startMoonGen(responseFunction:any,object:any):void{
      if(this.shouldRun) return null;
        let startHTTP= this.moonConnectService.post("/rest/moongen/", this.configurationService.getConfigurationObject());
        if(startHTTP!=null) {
          startHTTP .subscribe((response)=> {
                this.shouldRun = true;
                this.executionNumber = response.json().execution;
                this.subscribe = this.subscribeTestRunning();
                this.interval.next(0);
                responseFunction(response, false, object);
            }, error=> {
                this.shouldRun = false;
                this.moonConnectService.addAlert("danger", "MoonGen Start not working:" + error);
                responseFunction(error, true, object);
            });
        }else{
            return null;
        }
        }

    /**
     * Stopping MoonGen
     * @param responseFunction Function to use
     * @param object The Object for the Function
     * @returns {null}
     */
  public stopMoonGen(responseFunction:any,object:any):void{
      if(!this.shouldRun) return null
        let stopHTTP=this.moonConnectService.del("/rest/moongen/"+this.executionNumber+"/");
        if(stopHTTP!=null) {
            stopHTTP.subscribe(()=> {
                this.shouldRun = false;
                this.executionNumber = null;
                if(this.subscribe!=null){
                    this.subscribe.dispose();
                    this.subscribe = null;
                }
                responseFunction(null, false, object);
            }, (error)=> {
                this.shouldRun = true;
                this.moonConnectService.addAlert("danger", "MoonGen Stop not working:" + error);
                responseFunction(null, true, object)
            });
        }else{
            return null;
        }
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

    public getData(){
        if(!this.shouldRun) return null;
        return this.moonConnectService.get("/rest/moongen/"+this.executionNumber+"/");
    }

    public setTitle(title:string):void{
        this.configurationService.setTitle(title);
    }

    public getTitle():Subject<string>{
        return this.configurationService.getTitleSubscribe();
    }

}
