import {Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef} from '@angular/core';

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
  private configuration:any={showLink: false, displaylogo: false};
  private layout:any= {title: this.title,bargap: 0.05,bargrourgap:0.2,yaxis:{title: "Count"},xaxis:{title:"Value"}};
  private data:any=[];

  constructor(public element:ElementRef) {
  }

  ngAfterViewInit() {
      this.element.nativeElement.children[0].setAttribute("id", this.id);
      this.data.push({ x: this.points, type: 'histogram', autobinx: false, xbins:{start:Math.min.apply(Math,this.points),end:Math.max.apply(Math,this.points),size:this.size}});
      this.layout.title=this.title;
      Plotly.newPlot(this.id, this.data,this.layout,this.configuration);


  }
  ngOnChanges(changes){
      if(this.data!=[]&& this.data.length!=0) {
          var graphDiv=document.getElementById(this.id);
          if (changes.points) {
              var update1:any = {x:[],xbins:[]};
              update1.x.push(changes.points.currentValue);
              update1.xbins.push({start:Math.min.apply(Math,changes.points.currentValue),end:Math.max.apply(Math,changes.points.currentValue),size:this.size});
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

}
