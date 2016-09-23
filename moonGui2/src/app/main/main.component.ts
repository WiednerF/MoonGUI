import {
    Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener
} from '@angular/core';

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
   //TODO Remove
    private points: any=[{x:[1,2,3,4,5,1,4,8,9,1,4,5],name:"test1"},{x:[1,2,3,4,5,1,4,8,9,1,8,9,4,4,4,5],name:"test2"}];
    private pointsLine: any=[{x:[1,2,3,4,5,1,4,8,9,1,4,5],y:[-1,2,3,4,5,6,7,8,9,10,11,12,13],name:"test1"},{x:[1,2,3,4,5,1,4,8,9,1,8,9,4,4,4,5],y:[-1,2,3,4,5,6,7,8,9,10,11,12,13],name:"test2"}];
    private graphTitle = "test";

    /**
     * Get the Element for DOM Manipulation
     * @param element
     */
  constructor(public element:ElementRef) {

  }

  ngOnInit() {
    //INIT For DRAG
      this.stretch.horizontal.element=this.element.nativeElement.children[0];
      this.stretch.horizontal.bar=this.element.nativeElement.children[1];
      this.stretch.vertical.element=this.element.nativeElement.children[2].children[2];
      this.stretch.vertical.bar=this.element.nativeElement.children[2].children[1];
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

}
