import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class MoonConnectServiceService {

  constructor(private http:Http) { }

  public getConnection():Observable<Response>{
    return  this.head('rest/');
  }

  public get(url:string):Observable<Response>{
      return this.http.get(url);
  }

    public head(url:string):Observable<Response>{
        return this.http.head(url);
    }
    public post(url:string,body:any):Observable<Response>{
        return this.http.post(url,body);
    }

    public put(url:string,body:any):Observable<Response>{
        return this.http.put(url,body);
    }

    public del(url:string):Observable<Response>{
        return this.http.delete(url);
    }

}
