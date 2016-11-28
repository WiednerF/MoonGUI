import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {AlertComponent} from "../alert/alert.component";
/**
 * This Service is the basic Connection Service to the Backend and is based to reduce network traffic
 */
@Injectable()
export class MoonConnectServiceService {

    private alert: AlertComponent;//The AlertModule for Access to add different Alert Types
    private connect: boolean = true;//The Variable for the connection
    private connectChange: Subject<boolean> = new Subject<boolean>();//Registering for changes in the connect status
    private response: boolean = true;//If already responded to the previous request (If false, no request will be send out)

    /**
     *
     * @param http Injecting the HTTP Service of Angular2 for the connections
     */
    constructor(private http: Http) {
        this.testConnect();//Start to test the connection during the running of the software
    }

    /**
     * Test if the System run if it should run
     */
    private testConnect() {
        let obs = Observable.interval(5000);
        obs.subscribe(() => {
            this.testConnectFunction();
        });
        this.testConnectFunction();
    }

    /**
     * Run the test connection request
     */
    private testConnectFunction() {
        let connect = this.connect;
        if (this.response) {
            this.response = false;
            this.http.head("/rest/").subscribe(() => {
                if (!connect) {
                    this.addAlert("success", "Connection Established")
                }
                this.response = true;
                this.resultConnect(true, connect)
            }, () => {
                if (connect) {
                    this.addAlert("danger", "Connection Lost")
                }
                this.response = true;
                this.resultConnect(false, connect);
            });
        }
    }

    /**
     * Submit the result of the connection
     * @param result The result from the request
     * @param previous The previous value
     */
    private resultConnect(result: boolean, previous: boolean) {
        this.connect = result;
        if (result != previous) {
            this.connectChange.next(this.connect);
        }
    }

    /**
     * The Server will be stopped (Not interrupted)
     */
    public stopServer(): void {
        let delResponse: Observable<Response> = this.del("/rest/");
        if (delResponse != null) {
            delResponse.subscribe(() => {
                this.connect = false;
                this.connectChange.next(false);
                this.addAlert("success", "Successfully stopped server")
            }, (error) => this.addAlert("danger", "Could not stop Server:" + error));
        }
    }

    /**
     * Set the Variable alert to the Wanted value
     * @param mainAlertVariable
     */
    public setMainAlert(mainAlertVariable: AlertComponent) {
        this.alert = mainAlertVariable;
    }

    /**
     * Add a temporary Alert
     * @param type The Type like warning or info
     * @param message The String Message
     */
    public addAlert(type: string, message: string) {
        if (this.alert) {
            this.alert.addAlert(type, message);
        }
    }


    /**
     * Get the Connection HEad Message
     * @returns {Observable<Response>}
     */
    public getConnection(): Subject<boolean> {
        return this.connectChange;
    }

    /**
     * Get the Starting value of the variable connect (After registering to the Subject)
     * @returns {boolean}
     */
    public getConnectionStart(): boolean {
        return this.connect;
    }

    /**
     * The Get request
     * @param url
     * @returns {Observable<Response>}
     */
    public get(url: string): Observable<Response> {
        if (this.connect) {
            return this.http.get(url);
        } else {
            return null;
        }
    }

    /**
     * The head request
     * @param url
     * @returns {Observable<Response>}
     */
    public head(url: string): Observable<Response> {
        if (this.connect) {
            return this.http.head(url);
        } else {
            return null;
        }
    }

    /**
     * The Post request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public post(url: string, body: any): Observable<Response> {
        if (this.connect) {
            return this.http.post(url, body);
        } else {
            return null;
        }
    }

    /**
     * The put request
     * @param url
     * @param body
     * @returns {Observable<Response>}
     */
    public put(url: string, body: any): Observable<Response> {
        if (this.connect) {
            return this.http.put(url, body);
        } else {
            return null;
        }
    }

    /**
     * The delete request
     * @param url
     * @returns {Observable<Response>}
     */

    public del(url: string): Observable<Response> {
        if (this.connect) {
            return this.http.delete(url);
        } else {
            return null;
        }
    }

}
