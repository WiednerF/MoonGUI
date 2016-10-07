import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {Response} from "@angular/http";
import {MoonConnectServiceService} from "./moon-connect-service.service";

@Injectable()
export class MoonConfigurationService {

  private title:string="";
  private titleChange:Subject<string>=new Subject<string>();
  private packetNumber:number = 10;
    private packetNumberChange:Subject<number>=new Subject<number>();
   private interfaceTx:number=0;
    private interfaceTxChange:Subject<number>=new Subject<number>();
    private interfaceRx:number=1;
    private interfaceRxChange:Subject<number>=new Subject<number>();
//TODO Interface include in Configuration

  constructor(public connectService:MoonConnectServiceService) {

  }


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
    public getInterfaceTx():number{
        return this.interfaceTx;
    }
    public getInterfaceTxSubscribe():Subject<number>{
        return this.interfaceTxChange;
    }
    public setInterfaceTx(interfaceTx:number):void{
        this.interfaceTx=interfaceTx;
        this.interfaceTxChange.next(interfaceTx);
    }
    public getInterfaceRx():number{
        return this.interfaceRx;
    }
    public getInterfaceRxSubscribe():Subject<number>{
        return this.interfaceRxChange;
    }
    public setInterfaceRx(interfaceRx:number):void{
        this.interfaceRx=interfaceRx;
        this.interfaceRxChange.next(interfaceRx);
    }




    public getConfigurationObject():any{
        return {title:this.getTitle(),packetNr:this.getPacketNumber(),interfaces:{tx:this.getInterfaceTx(),rx:this.getInterfaceRx()}};
    }
}
