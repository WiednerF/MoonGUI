import { Component, OnInit,Input } from '@angular/core';
import {NgbSelfClosingAlertConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-main-alert',
  templateUrl: './main-alert.component.html',
  styleUrls: ['./main-alert.component.css'],
    providers: [NgbSelfClosingAlertConfig]
})
export class MainAlertComponent implements OnInit {

  @Input()
  public alerts: Array<{type:string,content:string}> = [{type:"info",content:"test"}];

    /**
     * Configuration of the Alert Time
     * @param selfClosingAlertConfig
     */
  constructor(selfClosingAlertConfig:NgbSelfClosingAlertConfig) {
      selfClosingAlertConfig.dismissible = true;
      selfClosingAlertConfig.dismissOnTimeout = 5000;
  }

  ngOnInit() {

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

