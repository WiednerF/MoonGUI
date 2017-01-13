import {
    Component, OnInit, ElementRef, HostListener
} from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {Observable} from "rxjs";
import {MoonConnectService} from "../services/moon-connect.service";
import {MoonConfigurationService} from "../services/moon-configuration.service";

declare let $:any;//Defines the access to the jQuery library
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
/**
 * The Class for the Inner MainPart of MoonGUI
 */
export class MainComponent implements OnInit {
    /**
     * Defines the toggle state of the three different parts of the software: config, graph and log
     * @type {any}
     */
    private toggle : {output: {status: boolean}, config:{status: boolean}, log: {status: boolean}, graph:{status: boolean}}={output:{status:true},config:{status:true}, log: {status:true}, graph: {status:true}};
    /**
     * For using to be able to resize the container
     * @type {any}
     */
    private stretch: {horizontal:{size:number,position:number,element:any,bar:any},vertical:{size:number,position:number,element:any,bar:any}}={horizontal:{size:-1,position:-1,element:null,bar:null},vertical:{size:-1,position:-1,element:null,bar:null}};
    /**
     * If the call for new data was already successfully
     * @type {boolean}
     */
    private responseData: boolean = true;
    /**
     * The execution number of the current process
     * @type {any}
     */
    private executionNumber:number = null;
    /**
     * Graph Configuration
     */
    private configurationObject:any={graph:[]};
    /**
     * The Point Data stored for each graph
     * @type {Array}
     */
    private pointData:any=[];
    /**
     * The number of data received
     * @type {number}
     */
    private dataCount:number=0;


    /**
     * Get the Element for DOM Manipulation
     * @param element The element for DOM access
     * @param moonGenService The MoonGen API Service
     * @param connectService The Connection Service for setting alerts
     * @param configuration The Configuration Service
     */
  constructor(public element:ElementRef, public moonGenService:MoonGenService, public connectService:MoonConnectService, public configuration:MoonConfigurationService) {
        this.configuration.getWait().subscribe(value=>{if(value){//Wait until configuration is written
            let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());
            if(!configurationObject.graph){
                configurationObject.graph=[];
            }
            this.configurationObject=this.initScript(configurationObject);
            this.configurationObject=configurationObject;
            this.configuration.getScriptChange().subscribe(()=>{let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());this.initScript(configurationObject);this.configurationObject=configurationObject});
        }});
  }

    /**
     * Initiates the changes of a script to the DOM for values of Data and ranges
     * @param configurationObject The Configuration Object to be used
     */
    private initScript(configurationObject:any):any{
        if(configurationObject.graph){
            this.pointData=[];
            for(let i:number=0;i<configurationObject.graph.length;i++){
                if(configurationObject.graph[i].type=="histogram"){
                    if(!configurationObject.graph[i].range){
                        configurationObject.graph[i].range = {max: 1000000,min: 0, step: 0.00001};
                    }
                    this.pointData[i]=[];
                    for(let x:number=0;x<configurationObject.graph[i].travers.length;x++){
                        this.pointData[i].push({x:[],title:configurationObject.graph[i].travers[x].title});
                    }
                }else if(configurationObject.graph[i].type=="line"){
                    this.pointData[i]=[];
                    for(let x:number=0;x<configurationObject.graph[i].travers.length;x++){
                        this.pointData[i].push({x:[],y:[],title:configurationObject.graph[i].travers[x].title});
                    }
                }
            }
        }
        this.dataCount=0;
        return configurationObject;//If the object is changed in same parts
    }


  ngOnInit() {
    //INIT For DRAG
      this.stretch.horizontal.element=this.element.nativeElement.children[0];
      this.stretch.horizontal.bar=this.element.nativeElement.children[1];
      this.stretch.vertical.element=this.element.nativeElement.children[2].children[2];
      this.stretch.vertical.bar=this.element.nativeElement.children[2].children[1];
      this.runningData();
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
    public toggleEvent(first:{status:boolean},second:{status:boolean}){
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
        Observable.interval(500).subscribe(()=> {
            if (this.moonGenService.getShouldRun() == true) {
                if (this.executionNumber != this.moonGenService.getExecutionNumber()) {
                    this.executionNumber = this.moonGenService.getExecutionNumber();
                    if (this.executionNumber != null){
                        this.configurationObject=this.initScript(this.configurationObject);
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
     * Get the Data from external
     */
    private getData() {
        let data = this.moonGenService.getData(this.dataCount);
        this.responseData = false;
        if (data != null) {
            data.timeout(5000,new Error("Timeout exceeded")).map(response=>response.json()).subscribe(response=> {
                this.responseData = true;
                let result = response.data;
                if(response.count) {
                    this.dataCount = response.count;
                }
                if(this.configurationObject&&this.configurationObject.graph&&this.configurationObject.graph.length!=0) {
                    for(let x:number=0;x<this.configurationObject.graph.length;x++) {
                            if (this.configurationObject.graph[x].type == "histogram") {
                                for(let y:number=0;y<this.configurationObject.graph[x].travers.length;y++) {
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i][this.configurationObject.graph[x].travers[y].x]) {
                                            this.pointData[x][y].x.push(result[i][this.configurationObject.graph[x].travers[y].x]);
                                        }
                                    }
                                }
                            } else if (this.configurationObject.graph[x].type == "line") {
                                for(let y:number=0;y<this.configurationObject.graph[x].travers.length;y++) {
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i][this.configurationObject.graph[x].travers[y].y]) {
                                            this.pointData[x][y].x.push(result[i][this.configurationObject.graph[x].travers[y].x]);
                                            this.pointData[x][y].y.push(result[i][this.configurationObject.graph[x].travers[y].y]);
                                        }
                                    }
                                }
                            }
                            if (result.length > 0) {
                                this.pointData[x] = JSON.parse(JSON.stringify(this.pointData[x]));
                            }
                    }
                }
            }, (error)=> {
                this.connectService.addAlert("danger", "Data Error: " + error);
                this.responseData = true;
            });
        }
    }
}
