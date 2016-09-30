import {
    Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener
} from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {Observable} from "rxjs";
import {MoonConnectServiceService} from "../services/moon-connect-service.service";

declare var $:any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
/**
 * The Class for the Inner MainPart of MoonGUI
 */
export class MainComponent implements OnInit {
    @Input() public status:{running: boolean, status: string, progressBar : {show: boolean, value: number, max: number}};
    @Output() public statusChange:EventEmitter<{}> = new EventEmitter();//The Statusbar
    private toggle : {output: {status: boolean}, config:{status: boolean}, log: {status: boolean}, graph:{status: boolean}}={output:{status:true},config:{status:true}, log: {status:true}, graph: {status:true}};
    /**
     * For using to be able to resize the container
     * @type {{horizontal: {size: number; position: number; element: any; bar: any}; vertical: {size: number; position: number; element: any; bar: any}}}
     */
    private stretch: {horizontal:{size:number,position:number,element:any,bar:any},vertical:{size:number,position:number,element:any,bar:any}}={horizontal:{size:-1,position:-1,element:null,bar:null},vertical:{size:-1,position:-1,element:null,bar:null}};
    private seekData:number = 0;
    private responseData: boolean = true;
    private executionNumber:number = null;
    private points: any=[{x:[],name:"Latency Distribution"}];
    private pointsLine: any=[{x:[],y:[],name:"Latency"}];

    /**
     * Get the Element for DOM Manipulation
     * @param element
     * @param moonGenService
     * @param connectService
     */
  constructor(public element:ElementRef,public moonGenService:MoonGenService,public connectService:MoonConnectServiceService) {

  }

  ngOnInit() {
    //INIT For DRAG
      this.stretch.horizontal.element=this.element.nativeElement.children[0];
      this.stretch.horizontal.bar=this.element.nativeElement.children[1];
      this.stretch.vertical.element=this.element.nativeElement.children[2].children[2];
      this.stretch.vertical.bar=this.element.nativeElement.children[2].children[1];
      this.runningData()
  }
  @HostListener('mouseup',['$event'])
  onMouseUp(event){
      if(this.stretch.horizontal.size!=-1) {
          this.dragStop(event, 'horizontal');
      }else if(this.stretch.vertical.size!=-1){
          this.dragStop(event, 'vertical');
      }
  }

    @HostListener('mousemove',['$event'])
    onMouseMove(event){
        if(this.stretch.horizontal.size!=-1) {
            this.drag(event,'horizontal');
        }else if(this.stretch.vertical.size!=-1) {
            this.drag(event, 'vertical');
        }
    }

    /**
     * Resizing the container
     * @param $event
     * @param type horizontal or vertical
     */
    drag($event,type:any){
        if(type=="horizontal"){
                $(this.stretch.horizontal.element).css('width', this.stretch.horizontal.size+($event.pageX-this.stretch.horizontal.position)+"px");
        }else if(type=="vertical"){
                $(this.stretch.vertical.element).css('height', this.stretch.vertical.size-($event.y-this.stretch.vertical.position)+"px");
        }
    }

    /**
     * Preparing of the container move
     * @param $event
     * @param type
     */
    dragStart($event,type:string){
        if(type=="horizontal"){
            this.stretch.horizontal.position=$event.pageX;
            this.stretch.horizontal.size=$(this.stretch.horizontal.element).width();
        }else if(type=="vertical"){
            this.stretch.vertical.position=$event.y;
            this.stretch.vertical.size=$(this.stretch.vertical.element).height();
        }
  }

    /**
     * Stopping of the container move
     * @param $event
     * @param type
     */
  dragStop($event,type:string){
      if(type=="horizontal"){
          this.stretch.horizontal.position=-1;
          this.stretch.horizontal.size=-1;
      }else if(type=="vertical"){
          this.stretch.vertical.position=-1;
          this.stretch.vertical.size=-1;
      }
  }

    /**
     * Open or close the container
     * @param first
     * @param second
     */
  toggleEvent(first:{status:boolean},second:{status:boolean}){
      if(first.status){
          second.status=false;
      }else{
          first.status=true;
      }
  }

    /**
     * Starts the Process for Fetching Log File
     */
    private runningData() {
        Observable.interval(3000).subscribe(()=> {
            if (this.moonGenService.getShouldRun() == true) {
                if (this.executionNumber != this.moonGenService.getExecutionNumber()) {
                    this.executionNumber = this.moonGenService.getExecutionNumber();
                    if (this.executionNumber != null){
                        this.initiateData();
                        this.responseData = true;
                    }
                }
                if (this.responseData) {
                    this.getData();
                }
            }
        });
    }

    /**
     * Get the Data from extern
     */
    private getData() {
        let data = this.moonGenService.getData(this.seekData);
        this.responseData = false;
        if (data != null) {
            data.timeout(3000,new Error("Timeout exceeded")).map(response=>response.json()).subscribe(response=> {
                this.seekData = response.seek;
                this.responseData = true;
                var result = response.data;
            }, (error)=> {
                this.connectService.addAlert("danger", "Data Error: " + error);
                this.responseData = true;
            });
        }
    }

    /**
     * Initiate the DOM for the data
     */
    private initiateData() {
        this.seekData = 0;
        for(var i=0;i<this.points.length;i++){
            this.points[i].x=[];
        }
        for(var i=0;i<this.points.length;i++){
            this.pointsLine[i].x=[];
            this.pointsLine[i].y=[];
        }
        console.log(JSON.parse(JSON.stringify(this.points)));
    }

}
