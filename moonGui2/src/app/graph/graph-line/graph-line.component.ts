import {Component, Input, OnChanges, AfterViewInit, ElementRef} from '@angular/core';

declare var Plotly: any;
declare var document: any;

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html'
})
/**
 * Generates a standard graph template for a line graph
 */
export class GraphLineComponent implements OnChanges,AfterViewInit {
  @Input() public points:any;
  @Input() public title:string;
  @Input() public id:string;
  @Input() public max:number;
  private configuration:any={showLink: false,displaylogo: false};
  private layout:any= {title: this.title,bargap: 0.05,bargrourgap:0.2,yaxis:{title: "Count"},xaxis:{title:"Value", autorange: false,range:[0,1000000]}};
  private data:any=[];

    constructor(public element:ElementRef) {
    }

    ngAfterViewInit() {
        this.element.nativeElement.children[0].setAttribute("id", this.id);
        for(let i:number=0;i<this.points.length;i++){
            this.data.push({x: this.points[i].x, y: this.points[i].y, name:this.points[i].title, mode: 'lines',});
        }
        this.layout.title=this.title;
        Plotly.newPlot(this.id, this.data,this.layout,this.configuration);


    }
    ngOnChanges(changes){
        if(this.data!=[]&& this.data.length!=0) {
            var graphDiv=document.getElementById(this.id);
            if (changes.points) {
                var update1:any = {x:[],y:[]};
                for(let i:number=0;i<changes.points.currentValue.length;i++) {
                    update1.x.push(changes.points.currentValue[i].x);
                    update1.y.push(changes.points.currentValue[i].y);
                }
                Plotly.restyle(graphDiv,update1);
         if(changes.points.currentValue.length>0) {
             if (changes.points.currentValue[0].x.length > this.max) {
                 var update3 = {xaxis: {range: [changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - (this.max)], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]]}};
                 Plotly.relayout(graphDiv, update3)
             } else {
                 var update2 = {xaxis: {range: [changes.points.currentValue[0].x[0], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]]}};
                 Plotly.relayout(graphDiv, update2);
             }
         }
            }

            if (changes.title) {
                var update = {
                    title: changes.title.currentValue
                };
                Plotly.relayout(graphDiv,update);
            }
        }
    }

}
