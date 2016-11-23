import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-main-alert',
  templateUrl: './main-alert.component.html',
  styleUrls: ['./main-alert.component.css']
})
/**
 * The Class for the Main Alerts on the top of the Page
 */
export class MainAlertComponent implements OnInit {

  @Input()
  public alerts: Array<{type:string,content:string}> = [];//All the Alert types

  constructor() {
  }

  ngOnInit() {

  }

    /**
     * Internal for Closing the Alerts
     * @param i
     */
    public closeAlert(i:number):void {
        this.alerts.splice(i, 1);
    }

  /**
   * Add a new Alert to the see type
   * @param type Danger, info, warning, success
   * @param content The Content to be displayed
   */
  public addAlert(type:string,content:string) {
    this.alerts.push({type:type,content:content});
  }
}

