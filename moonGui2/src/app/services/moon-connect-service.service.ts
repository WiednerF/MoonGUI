import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {MainAlertComponent} from "../main-alert/main-alert.component";
/**
 * This Service is the basic Connection Service to the Backend
 */
@Injectable()
export class MoonConnectServiceService {

    private mainAlert:MainAlertComponent;//The AlertModule for Access

  constructor(private http:Http) { }

    /**
     * Set the Variable mainAlert to the Wanted value
     * @param mainAlertVariable
     */
  public setMainAlert(mainAlertVariable:MainAlertComponent){
      this.mainAlert=mainAlertVariable;
        console.log(this);
  }

    /**
     * Add a temporary Alert
     * @param type The Type like warning or info
     * @param message The String Message
     */
  public addAlert(type:string,message:string){
      this.mainAlert.addAlert(type,message);
  }

    /**
     * Get the Connection HEad Message
     * @returns {Observable<Response>}
     */
  public getConnection():Observable<Response>{
    return  this.head('rest/');
  }

    /**
     * The Get request
     * @param url
     * @returns {Observable<Response>}
     */
  public get(url:string):Observable<Response>{
      return this.http.get(url);
  }

    /**
     * The head request
     * @param url
     * @returns {Observable<Response>}
     */
    public head(url:string):Observable<Response>{
        return this.http.head(url);
    }
    /**
     * The Post request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public post(url:string,body:any):Observable<Response>{
        return this.http.post(url,body);
    }

    /**
     * The put request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public put(url:string,body:any):Observable<Response>{
        return this.http.put(url,body);
    }

    /**
     * The delete request
     * @param url
     * @returns {Observable<Response>}
     */

    public del(url:string):Observable<Response>{
        return this.http.delete(url);
    }

}
