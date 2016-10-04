import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class MoonConfigurationService {

  private title:string="";
  private titleChange:Subject<string>=new Subject<string>();


  constructor() { }


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



    public getConfigurationObject():any{
        return {title:this.getTitle()};
    }
}
