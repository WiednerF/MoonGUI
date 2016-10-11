import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonConnectServiceService} from "./moon-connect-service.service";

@Injectable()
export class MoonConfigurationService {
    /**
     * Stores the Configuration Information for all scripts
     */
    private configuration: any;
    private script:number=0;
    private scriptChange:Subject<number>=new Subject<number>();
    private interfaceNodes:any=[];
    private interfacesChange:Subject<any>=new Subject<any>();
    private input:any[]=[];
    private inputChange:Subject<any>=new Subject<any>();
    private title:string="";
    private titleChange:Subject<string>=new Subject<string>();
    private wait:Subject<boolean>=new Subject<boolean>();

  constructor(public connectService:MoonConnectServiceService) {
      this.configurationHttp();
  }
  public configurationHttp(){
      this.connectService.get("/config/").map((result)=>result.json()).subscribe((result)=>this.writeConfiguration(result),(error)=>{this.configurationHttp()});
    }
  public writeConfiguration(config:any){
      this.configuration=config;
      this.setTitle(this.configuration[this.script].name);
      this.wait.next(true);
  }

  public getWait():Subject<boolean>{
      return this.wait;
  }

  public getConfiguration(id:number):any{
      return this.configuration[id];
  }
  public getConfigurationList():any{
      return this.configuration;
  }
  public getScript():number{
      return this.script;
  }
  public setScript(script:number):void{
      this.setTitle(this.getConfigurationList()[script].name);
      this.script=script;
      this.interfaceNodes=[];
      this.input=[];
      this.scriptChange.next(script);
  }
  public getScriptChange():Subject<number>{
      return this.scriptChange;
  }
    //************STANDARD Configuration Options
    public getTitle():string{
        return this.title;
    }
    public getTitleSubscribe():Subject<string>{
        return this.titleChange;
    }
    public setTitle(title:string):void{
        this.title=title;
        this.titleChange.next(title);
    }
    //***********Standard Values
    public getInterface(id:number):number{
        if(this.configuration[this.script].configuration.interfaces.length>id){
            if(this.interfaceNodes[id]){
                return this.interfaceNodes[id];
            }else{
               this.interfaceNodes[id] = this.configuration[this.script].configuration.interfaces[id].standard;
                return this.interfaceNodes[id];
            }
        }
    }
    public getInterfaceChange():Subject<any>{
       return this.interfacesChange;
    }
    public setInterface(id:number,value:number):void{
        this.interfaceNodes[id] = value;
        this.interfacesChange.next({id:id,value:value});
    }
    public getInput(id:number):any{
        if(this.configuration[this.script].configuration.input.length>id){
            if(this.input[id]){
                return this.input[id];
            }else{
                this.input[id] = this.configuration[this.script].configuration.input[id].standard;
                return this.input[id];
            }
        }
    }
    public getInputChange():Subject<any>{
        return this.inputChange;
    }
    public setInput(id:number,value:any):void{
        this.input[id] = value;
        this.inputChange.next({id:id,value:value});
    }
    public getInterfaceList():Observable<Response>{
        return this.connectService.get("/rest/interfaces/");
    }

    public getConfigurationObject():any{
        let result=<any>{};
        result.title=this.getTitle();
        result.script=this.configuration[this.getScript()].name;
        let conf=this.getConfiguration(this.getScript());
        if(conf.configuration){
            if(conf.configuration.interfaces){
                result.interfaces={};
                for(let i:number = 0;i<conf.configuration.interfaces.length;i++){
                    if(this.interfaceNodes[i]){
                        result['interfaces'][conf.configuration.interfaces[i].conf]=this.interfaceNodes[i];
                    }else{
                        result['interfaces'][conf.configuration.interfaces[i].conf]=conf.configuration.interfaces[i].standard;
                    }
                }
            }
            if(conf.configuration.input){
                result.input={};
                for(let i:number = 0;i<conf.configuration.input.length;i++){
                    if(this.input[i]){
                        result['interfaces'][conf.configuration.input[i].conf]=this.input[i];
                    }else{
                        result['interfaces'][conf.configuration.input[i].conf]=conf.configuration.input[i].standard;
                    }
                }
            }
        }
        return result;
    }
}
