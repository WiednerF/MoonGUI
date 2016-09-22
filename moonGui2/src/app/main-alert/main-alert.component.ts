import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-main-alert',
  templateUrl: './main-alert.component.html',
  styleUrls: ['./main-alert.component.css']
})
export class MainAlertComponent implements OnInit {

  @Input()
  public alerts: Array<{type:string,content:string}> = [{type:'warning',content:'This alert will close automatically after 5 seconds'}];

  constructor() { }

  ngOnInit() {
  }

  public addAlert(type:string,content:string) {
    this.alerts.push({type:type,content:content});
  }
}
