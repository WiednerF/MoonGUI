import { Component, OnInit , Input, OnChanges } from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit,OnChanges {
    @Input() public connect: Observable<Response> = null;
    @Input() public running: boolean = false;
    @Input() public status: string = "";
    @Input() public progressBar: {show : boolean, max: number, value: number};
    private connectStatus=false;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(changes){
      if(changes.connect){
          changes.connect.currentValue.subscribe(
              () => this.connectStatus=true,
              (response) => this.connectStatus=false,
              () => console.log('Completed!')
          );
      }
  }

}
