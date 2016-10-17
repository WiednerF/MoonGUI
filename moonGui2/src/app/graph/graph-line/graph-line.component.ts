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
        this.data.push({ x: this.points.x,y: this.points.y, mode: 'lines', });
        this.layout.title=this.title;
        Plotly.newPlot(this.id, this.data,this.layout,this.configuration);


    }
    ngOnChanges(changes){
        if(this.data!=[]&& this.data.length!=0) {
            var graphDiv=document.getElementById(this.id);
            if (changes.points) {
                var update1:any = {x:[],y:[]};
                    update1.x.push(changes.points.currentValue.x);
                    update1.y.push(changes.points.currentValue.y);
                Plotly.restyle(graphDiv,update1);
		if(changes.points.currentValue.x.length>this.max){
			var update3 = {xaxis:{range:[changes.points.currentValue.x[changes.points.currentValue.x.length-(this.max)],changes.points.currentValue.x[changes.points.currentValue.x.length-1]]}};
			console.log(update3)
			Plotly.relayout(graphDiv,update3)
		}else{
			var update2 = {xaxis:{range:[changes.points.currentValue.x[0],changes.points.currentValue.x[changes.points.currentValue.x.length-1]]}};
			console.log(update2);
			Plotly.relayout(graphDiv,update2);
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
