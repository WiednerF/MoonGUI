import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {MainAlertComponent} from "../main-alert/main-alert.component";
/**
 * This Service is the basic Connection Service to the Backend
 */
@Injectable()
export class MoonConnectServiceService {

    private mainAlert:MainAlertComponent;//The AlertModule for Access
    private connect:boolean=true;//The Variable for the connection
    private connectChange:Subject<boolean>=new Subject<boolean>();
    private response:boolean=true;

  constructor(private http:Http) {
      this.testConnect();
  }

    /**
     * Test if the System run if it should run
     */
    private testConnect(){
        this.testConnectFunction();
        var obs=Observable.interval(5000);
        obs.subscribe(()=>{
           this.testConnectFunction();
        });
    }

    private testConnectFunction(){
        var connect=this.connect;
        if(this.response) {
            this.response = false;
            this.http.head("/rest/").subscribe(()=> {
                if (!connect) {
                    this.addAlert("info", "Connection Established")
                }
                this.response = true;
                this.resultConnect(true,connect)
            }, ()=> {
                if (connect) {
                    this.addAlert("danger", "Connection Lost")
                }
                this.response = true;
                this.resultConnect(false,connect);
            });
        }
    }

    private resultConnect(result:boolean,previous:boolean){
        this.connect=result;
        if (result != previous) {
            this.connectChange.next(this.connect);
        }
    }

    /**
     * Set the Variable mainAlert to the Wanted value
     * @param mainAlertVariable
     */
  public setMainAlert(mainAlertVariable:MainAlertComponent){
      this.mainAlert=mainAlertVariable;
  }

    /**
     * Add a temporary Alert
     * @param type The Type like warning or info
     * @param message The String Message
     */
  public addAlert(type:string,message:string){
        if(this.mainAlert) {
            this.mainAlert.addAlert(type, message);
        }
    }



    /**
     * Get the Connection HEad Message
     * @returns {Observable<Response>}
     */
  public getConnection():Subject<boolean>{
    return  this.connectChange;
  }

  public getConnectionStart():boolean{
    return this.connect;
}
    /**
     * The Get request
     * @param url
     * @returns {Observable<Response>}
     */
  public get(url:string):Observable<Response>{
        if(this.connect){
            return this.http.get(url);
        }else{
            return null;
        }
  }

    /**
     * The head request
     * @param url
     * @returns {Observable<Response>}
     */
    public head(url:string):Observable<Response>{
        if(this.connect){
            return this.http.head(url);
        }else{
            return null;
        }
    }
    /**
     * The Post request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public post(url:string,body:any):Observable<Response>{
        if(this.connect){
            return this.http.post(url,body);
        }else{
            return null;
        }
    }

    /**
     * The put request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public put(url:string,body:any):Observable<Response>{
        if(this.connect){
            return this.http.put(url,body);
        }else{
            return null;
        }
    }

    /**
     * The delete request
     * @param url
     * @returns {Observable<Response>}
     */

    public del(url:string):Observable<Response>{
        if(this.connect){
            return this.http.delete(url);
        }else{
            return null;
        }
    }

}
