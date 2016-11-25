import {Component, OnInit} from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {Observable} from "rxjs";
import {MoonConnectServiceService} from "../services/moon-connect-service.service";

declare let document:any;

@Component({
    selector: 'app-log-viewer',
    templateUrl: './log-viewer.component.html',
    styleUrls: ['./log-viewer.component.css']
})
/**
 * This class Generates the Viewer for the Real time log file
 */
export class LogViewerComponent implements OnInit {

    private executionNumber: number = -1;
    private response: boolean = true;
    private log: any = [];
    private seek: number = 0;

    constructor(private moonGenService: MoonGenService, private connectService: MoonConnectServiceService) {

    }

    ngOnInit() {
        this.runningLogFile();
    }

    /**
     * Starts the Process for Fetching Log File
     */
    private runningLogFile() {
        Observable.interval(3000).subscribe(()=> {
            if (this.moonGenService.getShouldRun() == true) {
                if (this.executionNumber != this.moonGenService.getExecutionNumber()) {
                    this.executionNumber = this.moonGenService.getExecutionNumber();
                    if (this.executionNumber != null){
                        this.initiateLog();
                        this.response = true;
                    }
                }
                if (this.response) {
                    this.getLog();
                }
            }
        });
    }

    /**
     * Get the Log from external
     */
    private getLog() {
        let logFile = this.moonGenService.getLogFile(this.seek);
        this.response = false;
        if (logFile != null) {
            logFile.timeout(30000,new Error("Timeout exceeded")).map(response=>response.json()).subscribe(response=> {
                this.seek = response.seek;
                this.response = true;
                let result = response.log;
                for(let i=0;i<result.length;i++) {
                    this.log.push(decodeURIComponent(result[i]));
                }
                if(result.length>0){
                    let elem = document.getElementsByClassName("flex-log")[0];
                    elem.scrollTop = elem.scrollHeight;
                }
            }, (error)=> {
                this.connectService.addAlert("danger", "Log File Error: " + error);
                this.response = true;
            });
        }
    }

    /**
     * Initiate the DOM for the Log
     */
    private initiateLog() {
        this.log = [];
        this.seek = 0;
    }

}
