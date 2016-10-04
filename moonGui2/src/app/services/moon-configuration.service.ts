import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class MoonConfigurationService {

  private title:string="";
  private titleChange:Subject<string>=new Subject<string>();
  private packetNumber:number = 10;
    private packetNumberChange:Subject<number>=new Subject<number>();


  constructor() {

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



    public getConfigurationObject():any{
        return {title:this.getTitle(),packetNr:this.getPacketNumber()};
    }
}
