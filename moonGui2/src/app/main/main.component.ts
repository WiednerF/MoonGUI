import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    @Input() public title:string;
    @Output() public titleChange:EventEmitter<string> = new EventEmitter();//TODO Fire Event for Change
    @Input() public status:{connect: boolean, running: boolean, status: string, progressBar : {show: boolean, value: number, max: number}};
    @Output() public statusChange:EventEmitter<{}> = new EventEmitter();//TODO Fire Event for Change
    private toggle : {output: boolean, config: boolean, log: boolean, graph: boolean}={output:true,config:true, log: true, graph: true};

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
