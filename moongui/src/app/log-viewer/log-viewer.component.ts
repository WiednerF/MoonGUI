import {Component, OnInit} from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {Observable} from "rxjs";
import {MoonConnectService} from "../services/moon-connect.service";

declare let document:any;//Declares the document to use it directly

@Component({
    selector: 'app-log-viewer',
    templateUrl: './log-viewer.component.html',
    styleUrls: ['./log-viewer.component.css']
})
/**
 * This class Generates the Viewer for the Real time log file
 */
export class LogViewerComponent implements OnInit {

    /**
     * the Number of the current Execution
     * @type {number}
     */
    private executionNumber: number = -1;
    /**
     * The boolean response, if the server has already responded
     * @type {boolean}
     */
    private response: boolean = true;
    /**
     * The Array of Log lines
     * @type {Array}
     */
    private log: any = [];
    /**
     * The current seek number in the log file
     * @type {number}
     */
    private seek: number = 0;

    /**
     *
     * @param moonGenService The MoonGen Service for Running MoonGen process
     * @param connectService The Connection Service for adding Alerts to the Alert Component
     */
    constructor(private moonGenService: MoonGenService, private connectService: MoonConnectService) {

    }

    ngOnInit() {
        this.runningLogFile();
    }

    /**
     * Starts the Process for Fetching the Log File
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
     * Get the Log from external resource
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
