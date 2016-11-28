import { Injectable } from '@angular/core';
import {MoonConnectService} from "./moon-connect.service";

@Injectable()
export class MoonHistoryService {

  constructor(public moonConnect:MoonConnectService) { }


  public clearAll():void{
    let del = this.moonConnect.del("/rest/history/");
    if(del!=null){
       del.subscribe(()=>{this.moonConnect.addAlert("success","Successfully deleted all history files")},(error)=>{this.moonConnect.addAlert("danger","Error in Deleting history files"+error)});
    }
  }

}
