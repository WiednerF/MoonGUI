import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonConnectService} from "./moon-connect.service";

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
    private author:string="";
    private authorChange:Subject<string>=new Subject<string>();
    private wait:Subject<boolean>=new Subject<boolean>();

  constructor(public connectService:MoonConnectService) {
      this.configurationHttp();
  }
  public configurationHttp(){
      let configHTTP= this.connectService.get("/config/");
      if(configHTTP!=null) {
        configHTTP.map((result)=>result.json()).subscribe((result)=>this.writeConfiguration(result), (error)=> {
            Observable.interval(2000).take(1).subscribe(()=>this.configurationHttp());
          });
      }else{
          Observable.interval(2000).take(1).subscribe(()=>this.configurationHttp());
      }
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
    public getAuthor():string{
        return this.author;
    }
    public getAuthorSubscribe():Subject<string>{
        return this.authorChange;
    }
    public setAuthor(author:string):void{
        this.author=author;
        this.authorChange.next(author);
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

    public getJSONConfiguration():string{
        return JSON.stringify({title: this.title, author: this.author, script: this.script, interfaceNodes: this.interfaceNodes, input: this.input });
    }

    /**
     * Generates the Config from saved file
     * @param res Must be a correct object
     */
    public setJSONConfiguration(res:any):void{
        if(res.script){
            this.setScript(res.script);
        }
        if(res.title){
            this.setTitle(res.title);
        }
        if(res.author){
            this.setAuthor(res.author);
        }
        if(res.interfaceNodes){
            for(let i:number = 0;i<res.interfaceNodes.length;i++){
                this.setInterface(i,res.interfaceNodes[i]);
            }
        }
        if(res.input){
            for(let i:number = 0;i<res.input.length;i++){
                this.setInput(i,res.input[i]);
            }
        }
    }

    public getConfigurationObject():any{
        let result=<any>{};
        result.title=this.getTitle();
        result.script=this.configuration[this.getScript()].name;
        result.author=this.getAuthor();
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
                        result['input'][conf.configuration.input[i].conf]=this.input[i];
                    }else{
                        result['input'][conf.configuration.input[i].conf]=conf.configuration.input[i].standard;
                    }
                }
            }
        }
        return result;
    }
}
