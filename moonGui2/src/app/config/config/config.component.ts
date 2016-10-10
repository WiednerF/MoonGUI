import { Component, OnInit } from '@angular/core';
import {MoonConfigurationService} from "../../services/moon-configuration.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  private configurationObject:any;
    private interfaceList:any=[];
    private interfaceNode:any=[];
    private numberOfPackets:number;
    //TODO Add Interface to Config View


  constructor(public configuration:MoonConfigurationService) {
      this.numberOfPackets=configuration.getPacketNumber();
      this.configurationObject=this.configuration.getConfiguration(this.configuration.getScript());
      this.initScript();
  }

  private initScript(){
      if(this.configurationObject.configuration){
          if(this.configurationObject.configuration.interfaces){
              this.interfaceNode=[];
              for(let i:number=0;i<this.configurationObject.configuration.interfaces.length;i++){
                  this.interfaceNode.push(this.configuration.getInterface(i));
              }
          }
      }
  }

  ngOnInit() {
      this.getInterfaceList();
      this.configuration.getPacketNumberSubscribe().subscribe((value)=>{this.numberOfPackets=value});
      this.configuration.getScriptChange().subscribe(()=>{this.configurationObject=this.configuration.getConfiguration(this.configuration.getScript());this.initScript()});
      this.configuration.getInterfaceChange().subscribe(value=>{this.interfaceNode[value.id]=value.value});
  }

    /**
     * Change the Number of Packets of the Component
     */
    public changeNumberOfPackets($event){
        this.configuration.setPacketNumber($event.target.value);
    }

    /**
     * Changes the Interface configuration
     * @param $event
     * @param id
     */
    public changeInterface($event,id){
        this.configuration.setInterface(id,$event);
        console.log(this);
    }

    private getInterfaceList(){
        this.getInterfaceListHTTP();
        Observable.interval(100000).subscribe(()=>{
            this.getInterfaceListHTTP();
        });
    }
    private getInterfaceListHTTP(){
        this.configuration.getInterfaceList().map((response)=>response.json()).subscribe((response)=>{
            this.interfaceList=response;
        },(error)=>console.log("Error: "+error));
    }


}
