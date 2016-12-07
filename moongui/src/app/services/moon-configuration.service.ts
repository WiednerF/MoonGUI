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
    /**
     * Stores the selected script number
     * @type {number}
     */
    private script:number=0;
    private scriptChange:Subject<number>=new Subject<number>();
    /**
     * Saves the information array for the interfaces loaded at the moment
     * @type {Array}
     */
    private interfaceNodes:any=[];
    private interfacesChange:Subject<any>=new Subject<any>();
    /**
     * Stores the input configuration of the current selected script
     * @type {Array}
     */
    private input:any[]=[];
    private inputChange:Subject<any>=new Subject<any>();
    /**
     * Stores the title of the current experiment
     * @type {string}
     */
    private title:string="";
    private titleChange:Subject<string>=new Subject<string>();
    /**
     * If the configurationObject is not loaded at the moment
     * @type {Subject<boolean>}
     */
    private wait:Subject<boolean>=new Subject<boolean>();

    /**
     * The connection service is needed to call the configuration object
      * @param connectService
     */
  constructor(public connectService:MoonConnectService) {
      this.configurationHttp();
  }

    /**
     * The loading process of the configuration object
     */
  public configurationHttp(){
      let configHTTP= this.connectService.get("/config/");
      if(configHTTP!=null) {
        configHTTP.map((result)=>result.json()).subscribe((result)=>this.writeConfiguration(result), ()=> {
            Observable.interval(2000).take(1).subscribe(()=>this.configurationHttp());
          });
      }else{
          Observable.interval(2000).take(1).subscribe(()=>this.configurationHttp());
      }
  }

    /**
     * Created the Graphical user interface out of the newly loaded config object
     * @param config The object loaded from the server
     */
  public writeConfiguration(config:any){
      this.configuration=config;
      this.setTitle(this.configuration[this.script].name);
      this.wait.next(true);
  }

    /**
     * Wait until the configuration object is received, can be subscribed here
     * @returns {Subject<boolean>}
     */
  public getWait():Subject<boolean>{
      return this.wait;
  }

    /**
     * Get the script specific configuration
     * @param id The id of the script
     * @returns {any}
     */
  public getConfiguration(id:number):any{
      return this.configuration[id];
  }

    /**
     * Get the complete Configuration object
     * @returns {any}
     */
  public getConfigurationList():any{
      return this.configuration;
  }

    /**
     * The selected script number
     * @returns {number}
     */
  public getScript():number{
      return this.script;
  }

    /**
     * Set the selected to a new script number and changes input parameter and all other script related things according to the script
     * @param script The script number for the selection process
     */
  public setScript(script:number):void{
      this.setTitle(this.getConfigurationList()[script].name);
      this.script=script;
      this.interfaceNodes=[];
      this.input=[];
      this.scriptChange.next(script);
  }

    /**
     * Subscribe to changes in the script selection
     * @returns {Subject<number>}
     */
  public getScriptChange():Subject<number>{
      return this.scriptChange;
  }
    //************STANDARD Configuration Options
    /**
     * Receive the current title
     * @returns {string}
     */
    public getTitle():string{
        return this.title;
    }

    /**
     * Subscribe to title changes
     * @returns {Subject<string>}
     */
    public getTitleSubscribe():Subject<string>{
        return this.titleChange;
    }

    /**
     * Change the title
     * @param title The new title value
     */
    public setTitle(title:string):void{
        this.title=title;
        this.titleChange.next(title);
    }
    //***********Standard Values
    /**
     * Get the selected interface
     * @param id Which selected interface (More then one are possible)
     * @returns {any}
     */
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

    /**
     * Subscribe to changes in the Interfaces
     * @returns {Subject<any>}
     */
    public getInterfaceChange():Subject<any>{
       return this.interfacesChange;
    }

    /**
     * Set a new value to the interfaces
     * @param id The id of the interface to change
     * @param value The value for the change
     */
    public setInterface(id:number,value:number):void{
        this.interfaceNodes[id] = value;
        this.interfacesChange.next({id:id,value:value});
    }

    /**
     * Get an input value
     * @param id The id of the wanted input value
     * @returns {any}
     */
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

    /**
     * Subscribe to changes in the input array
     * @returns {Subject<any>}
     */
    public getInputChange():Subject<any>{
        return this.inputChange;
    }

    /**
     * Set a new value to the inputs
     * @param id The input id
     * @param value The vnew value to this input id
     */
    public setInput(id:number,value:any):void{
        this.input[id] = value;
        this.inputChange.next({id:id,value:value});
    }

    /**
     * Call the interface list with interface names from the server
     * @returns {Observable<Response>}
     */
    public getInterfaceList():Observable<Response>{
        return this.connectService.get("/rest/interfaces/");
    }

    /**
     * Get the complete configuration as JSON object to be able to save it
     * @returns {string}
     */
    public getJSONConfiguration():string{
        return JSON.stringify({title: this.title, script: this.script, interfaceNodes: this.interfaceNodes, input: this.input });
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

    /**
     * Generates the configuration object needed from the MoonGen process for configuration
     * @returns {any}
     */
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
