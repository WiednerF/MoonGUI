import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {MoonConnectServiceService} from "./services/moon-connect-service.service";
import {Response} from "@angular/http";
import {MoonGenService} from "./services/moon-gen.service";

@Component({
    selector: 'moon-gui',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers:[MoonConnectServiceService,MoonGenService]
})
export class AppComponent implements OnInit{
    public status: {connect: Observable<Response>, status: string, progressBar: {show: boolean, value: number, max: number}} = {
        connect: null,
        status: "",
        progressBar: {show: true, value: 50, max: 100}
    };
    public title: string = "Test";

    constructor(public moonConnectService:MoonConnectServiceService) {
        this.status.connect=this.moonConnectService.getConnection();
    }

    ngOnInit(){
        this.connectTest();
    }

    connectTest(){
        var obs = Observable.interval(10000);
        obs.subscribe(()=>{
            this.status.connect=this.moonConnectService.getConnection();
        });
    }
}
