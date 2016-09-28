import { Component, OnInit } from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {Observable} from "rxjs";
import {MoonConnectServiceService} from "../services/moon-connect-service.service";

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
/**
 * This class Generates the Viewer for the Real time log file
 */
export class LogViewerComponent implements OnInit {

    private executionNumber:number=-1;
    private lineNumber:number=0;
    private response:boolean=true;
    private log: any = [];

  constructor(private moonGenService:MoonGenService,private connectService:MoonConnectServiceService) {

  }

  ngOnInit() {
      this.runningLogFile();
  }

    /**
     * Starts the Process for Fetching Log File
     */
  private runningLogFile(){
      Observable.interval(100).subscribe(()=>{
          if(this.moonGenService.getRunning()==true){
            if(this.executionNumber!=this.moonGenService.getExecutionNumber()){
                this.executionNumber=this.moonGenService.getExecutionNumber();
                if(this.executionNumber!=null)this.cleanLog();
                this.initiateLog();
            }
            if(this.response){
                this.getLog();
            }
          }
      });
  }

    /**
     * Get the Log from extern
     */
  private getLog(){
      let logFile=this.moonGenService.getLogFile(this.lineNumber);
        this.response=false;//TODO Problems Getting Array correct
        if(logFile!=null){
            logFile.map(response=>response.json()).subscribe(response=>{this.lineNumber=response.lines;this.response=true;this.log=this.log.concat(response.log);console.log(this.log);console.log(response)},(error)=>{this.connectService.addAlert("danger","Log File Error: "+error);this.response=false});
        }
        //tODO
  }
    /**
     * Clean the old log for a new one
     */
  private cleanLog(){
      //TODO
  }

    /**
     * Initiate the DOM for the Log
     */
  private initiateLog(){
      this.lineNumber=0;
        this.log=[];
      //TODO
  }

}
