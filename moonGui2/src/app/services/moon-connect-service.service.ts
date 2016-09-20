import {Injectable, Inject} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class MoonConnectServiceService {

  constructor(private http:Http) { }

  public getConnection():Observable<Response>{
    return  this.http.head('rest/');
  }

}
