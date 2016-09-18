import {Component} from '@angular/core';

@Component({
    selector: 'moon-gui',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public status: {connect: boolean, running: boolean, status: string, progressBar: {show: boolean, value: number, max: number}} = {
        connect: false,
        running: false,
        status: "",
        progressBar: {show: false, value: 0, max: 100}
    };
    public title: string = "Test";

    constructor() {

    }

}
