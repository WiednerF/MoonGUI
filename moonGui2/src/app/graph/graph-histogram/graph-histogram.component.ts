import {Component, OnInit, Input, OnChanges} from '@angular/core';

declare var Plotly: any;
declare var document: any;

@Component({
  selector: 'app-graph-histogram',
  templateUrl: './graph-histogram.component.html'
})
export class GraphHistogramComponent implements OnInit,OnChanges {
  @Input() public points:any;
  @Input() public title:string;
    private name:string="graph-histogram";
  private configuration:any={showLink: false,displaylogo: false};
  private layout:any= {title: this.title,bargap: 0.05,bargrourgap:0.2,yaxis:{title: "Count"},xaxis:{title:"Value"}};
  private data:any=[];

  constructor() {
  }

  ngOnInit() {
      for(let travers of this.points){
          this.data.push({name: travers.name , x: travers.x, type: 'histogram', autobinx: false, xbins:{start:Math.min.apply(Math,travers.x),end:Math.max.apply(Math,travers.x),size:1}});
      }
      this.layout.title=this.title;
      Plotly.newPlot(this.name, this.data,this.layout,this.configuration);


  }
  ngOnChanges(changes){
      if(this.data!=[]&& this.data.length!=0) {
          var graphDiv=document.getElementById(this.name);
          if (changes.points) {
              var update1:any = {x:[]};
              for(let travers of changes.points.currentValue){
                  update1.x.push(travers.x);
              }
              Plotly.restyle(graphDiv,update1);
          }

          if (changes.title) {
              var update = {
                  title: changes.title.currentValue
              };
          }
          Plotly.relayout(graphDiv,update);
      }
      console.log(changes);
  }

}