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
    private input:any=[];

  constructor(public configuration:MoonConfigurationService) {
      this.configuration.getWait().subscribe(value=>{if(value){
          let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());
          this.initScript(configurationObject);
          this.configurationObject=configurationObject;
          this.configuration.getScriptChange().subscribe(()=>{let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());this.initScript(configurationObject);this.configurationObject=configurationObject});
          this.configuration.getInterfaceChange().subscribe(value=>{this.interfaceNode[value.id]=value.value});
          this.configuration.getInputChange().subscribe(value=>{this.input[value.id]=value.value});
      }});
  }

  private initScript(configurationObject){
      if(configurationObject.configuration){
          if(configurationObject.configuration.interfaces){
              this.interfaceNode=[];
              for(let i:number=0;i<configurationObject.configuration.interfaces.length;i++){
                  this.interfaceNode.push(this.configuration.getInterface(i));
              }
          }
          if(configurationObject.configuration.input){
              this.input=[];
              for(let i:number=0;i<configurationObject.configuration.input.length;i++){
                  this.input.push(this.configuration.getInput(i));
              }
          }
      }
  }

  ngOnInit() {
      this.getInterfaceList();

  }

    /**
     * Changes the Interface configuration
     * @param $event
     * @param id
     */
    public changeInterface($event,id){//TODO Use ngModelChange
        this.configuration.setInterface(id,$event);
        this.interfaceNode[id]=$event;
    }
    /**
     * Changes the Input configuration
     * @param $event
     * @param id
     */
    public changeInput($event,id){
        this.configuration.setInput(id,$event);
        this.input[id]=$event;
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

    private getProp(name:string,id:number){
        return this[name][id];
    }


}
