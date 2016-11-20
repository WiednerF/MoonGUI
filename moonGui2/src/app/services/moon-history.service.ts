import { Injectable } from '@angular/core';
import {MoonConnectServiceService} from "./moon-connect-service.service";

@Injectable()
export class MoonHistoryService {

  constructor(public moonConnect:MoonConnectServiceService) { }


  public clearAll():void{
    let del = this.moonConnect.del("/rest/history/");
    if(del!=null){
       del.subscribe(()=>{this.moonConnect.addAlert("success","Successfully deleted all history files")},(error)=>{this.moonConnect.addAlert("danger","Error in Deleting history files"+error)});
    }
  }

}
