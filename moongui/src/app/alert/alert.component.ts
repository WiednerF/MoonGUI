import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.css']
})
/**
 * The Class for the Main Alerts on the top of the Page
 */
export class AlertComponent {

  @Input()
  public alerts: Array<{type:string,content:string}> = [];//All the Alert that are out on this moment

  constructor() {
  }
    /**
     * Internal for Closing the Alerts
     * @param i
     */
    public closeAlert(i:number):void {
        this.alerts.splice(i, 1);
    }

  /**
   * Add a new Alert to the alerts visible
   * @param type Danger, info, warning, success
   * @param content The Content to be displayed
   */
  public addAlert(type:string,content:string) {
    this.alerts.push({type:type,content:content});
  }
}

