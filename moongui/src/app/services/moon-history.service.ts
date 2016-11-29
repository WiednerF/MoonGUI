import {Injectable} from '@angular/core';
import {MoonConnectService} from "./moon-connect.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

/**
 * This Service connects the frontend representation with the history API
 */
@Injectable()
export class MoonHistoryService {

    /**
     *
     * @param moonConnect The Connection Service to the Server
     */
    constructor(public moonConnect: MoonConnectService) {
    }


    /**
     * This methods clears all data previously stored in the history folder on the server
     */
    public clearAll(): void {
        let del:Observable<Response> = this.moonConnect.del("/rest/history/");//The request is started
        if (del != null) {//del is only null, if the connection is not possible
            del.subscribe(() => {
                this.moonConnect.addAlert("success", "Successfully deleted all history files")
            }, (error) => {
                this.moonConnect.addAlert("error", "Error in Deleting history files: " + error)
            });
        }
    }

}
