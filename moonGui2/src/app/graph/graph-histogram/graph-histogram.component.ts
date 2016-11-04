import {Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";

declare var Plotly: any;
declare var document: any;

@Component({
  selector: 'app-graph-histogram',
  templateUrl: './graph-histogram.component.html'
})
/**
 * Generates a standard graph template for a histogram
 */
export class GraphHistogramComponent implements OnChanges,AfterViewInit {
  @Input() public points:any;
  @Input() public title:string;
    @Input() public size:number;
    @Input() public id:string;

    @ViewChild('editModal') public editModal:ModalDirective;
  private configuration:any={showLink: false, displaylogo: false};
  private layout:any= {title: this.title,bargap: 0.05,bargroupgap:0.2,yaxis:{title: "Count"},xaxis:{title:"Value"},autosize: true};
  private data:any=[];

  constructor(public element:ElementRef) {
  }

  ngAfterViewInit() {
      this.element.nativeElement.children[0].children[0].setAttribute("id", this.id);
      for(let i:number=0;i<this.points.length;i++) {
          this.data.push({
              name: this.points[i].title,
              x: this.points[i].x,
              type: 'histogram',
              autobinx: false,
              xbins: {start: Math.min.apply(Math, this.points[i].x), end: Math.max.apply(Math, this.points[i].x), size: this.size}
          });
      }
      this.layout.title=this.title;
      Plotly.newPlot(this.id, this.data,this.layout,this.configuration);


  }
  ngOnChanges(changes){
      if(this.data!=[]&& this.data.length!=0) {
          var graphDiv=document.getElementById(this.id);
          if (changes.points) {
              var update1:any = {x:[],xbins:[]};
              for(let i:number=0;i<changes.points.currentValue.length;i++) {
                  update1.x.push(changes.points.currentValue[i].x);
                  update1.xbins.push({
                      start: Math.min.apply(Math, changes.points.currentValue[i].x),
                      end: Math.max.apply(Math, changes.points.currentValue[i].x),
                      size: this.size
                  });
              }
              Plotly.restyle(graphDiv,update1);
          }

          if (changes.title) {
              var update = {
                  title: changes.title.currentValue
              };
              Plotly.relayout(graphDiv,update);
          }
      }
  }
  private changeYAxisTitle($event){
      var graphDiv=document.getElementById(this.id);
      Plotly.relayout(graphDiv, {yaxis:{title:$event}});
  }

    private changeXAxisTitle($event){
        var graphDiv=document.getElementById(this.id);
        Plotly.relayout(graphDiv, {xaxis:{title:$event}});
    }

    private changeTitle($event){
        var graphDiv=document.getElementById(this.id);
        Plotly.relayout(graphDiv, {title:$event});
    }



}
