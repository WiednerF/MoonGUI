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

//TODO Create Configuration for all different executionScripts
    private interfaceNodes:any=[];
    private interfacesChange:Subject<any>=new Subject<any>();
    private slider:[number];
    private sliderChange:Subject<any>=new Subject<any>();

  private title:string="";
  private titleChange:Subject<string>=new Subject<string>();
  private packetNumber:number = 10;
    private packetNumberChange:Subject<number>=new Subject<number>();
   private interfaceTx:number=0;
    private interfaceTxChange:Subject<number>=new Subject<number>();
    private interfaceRx:number=1;
    private interfaceRxChange:Subject<number>=new Subject<number>();

  constructor(public connectService:MoonConnectServiceService) {
        this.configuration=[//TODO Erweitern und Dokumentieren
            {name:"moongen-server.lua",
             configuration:{
                 interfaces:[
                     {
                         standard: 0,
                         name: "TX Interface",
                         conf: "tx"
                     },
                     {
                         standard:1,
                         name: "RX Interface",
                         conf: "rx"
                     }
                 ],
                 input:[
                     {
                         standard: 10,
                         type: "range",
                         name: "PacketNumber in 10^",
                         unit: "10^",
                         conf: "pktNr",
                         max: 100,
                         min: 1,
                         step: 1
                     }
                 ]
             }
            },
            {name:"timestamp.lua",
                configuration:{
                    interfaces:[
                        {
                            standard:1,
                            name: "RX Interface",
                            conf: "rx"
                        }
                    ],
                    input:[
                        {
                            standard: 50,
                            type: "range",
                            name: "PacketNumber in [10^]",
                            unit: "10^",
                            conf: "pktNr",
                            max: 150,
                            min: 1,
                            step: 2
                        }
                    ]
                }
            }
        ];
      this.setTitle(this.configuration[this.script].name);
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
        console.log(id);
        if(this.configuration[this.script].configuration.interfaces.length>id){
            console.log(id);
            if(this.interfaceNodes[id]){
                console.log(id);
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

  //TODO To new Format

    public getPacketNumber():number{
        return this.packetNumber;
    }
    public getPacketNumberSubscribe():Subject<number>{
        return this.packetNumberChange;
    }
    public setPacketNumber(PacketNumber:number):void{
        this.packetNumber=PacketNumber;
        this.packetNumberChange.next(PacketNumber);
    }
    public getInterfaceList():Observable<Response>{
        return this.connectService.get("/rest/interfaces/");
    }

    public getConfigurationObject():any{
        let result=<any>{};
        result.title=this.getTitle();
        result.packetNr=this.getPacketNumber();
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
        }
        return result;
    }
}
