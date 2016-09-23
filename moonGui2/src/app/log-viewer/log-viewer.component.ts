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

  constructor(private moonGenService:MoonGenService) {

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
                if(this.executionNumber!=-1)this.cleanLog();
                this.initiateLog();
            }
            this.getLog();
          }
      });
  }

    /**
     * Get the Log from extern
     */
  private getLog(){
      //TODO
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
      //TODO
  }

}
