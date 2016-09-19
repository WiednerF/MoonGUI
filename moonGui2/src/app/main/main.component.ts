import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import {Observable, Subscriber} from "rxjs";

declare var Object: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    @Input() public title:string;
    @Output() public titleChange:EventEmitter<string> = new EventEmitter<string>();
    @Input() public status:{connect: boolean, running: boolean, status: string, progressBar : {show: boolean, value: number, max: number}};
    @Output() public statusChange:EventEmitter<{}> = new EventEmitter();
    private toggle : {output: boolean, config: boolean, log: boolean, graph: boolean}={output:true,config:true, log: true, graph: true};
    private points: any=[{x:[1,2,3,4,5,1,4,8,9,1,4,5],name:"test1"},{x:[1,2,3,4,5,1,4,8,9,1,8,9,4,4,4,5],name:"test2"}];
    private pointsLine: any=[{x:[1,2,3,4,5,1,4,8,9,1,4,5],y:[-1,2,3,4,5,6,7,8,9,10,11,12,13],name:"test1"},{x:[1,2,3,4,5,1,4,8,9,1,8,9,4,4,4,5],y:[-1,2,3,4,5,6,7,8,9,10,11,12,13],name:"test2"}];
    private graphTitle = "test";

  constructor() {
  }

  ngOnInit() {
  }

 toggleFirstLevel(type:string){
     if(type=="left"){
         if(this.toggle.output){
             this.toggle.config=false;
         }else{
             this.toggle.output=true;
         }
     }
     if(type=="right"){
         if(this.toggle.config){
             this.toggle.output=false;
         }else{
             this.toggle.config=true;
         }
     }
 }

    toggleSecondLevel(type:string){
        if(type=="left"){
            if(this.toggle.log){
                this.toggle.graph=false;
            }else{
                this.toggle.log=true;
            }
        }
        if(type=="right"){
            if(this.toggle.graph){
                this.toggle.log=false;
            }else{
                this.toggle.graph=true;
            }
        }
    }

}
