import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-config-part',
    templateUrl: './config-part.component.html',
    styleUrls: ['./config-part.component.css']
})
export class ConfigPartComponent implements OnInit {

    private tabs: [{}] = [{title: "Start/Stop", disabled: false, content: "TODO"}, {
        title: "Configuration",
        disabled: false,
        content: "TODO"
    }, {title: "System", disabled: false, content: "TODO"}, {title: "Graph", disabled: true, content: "TODO"}];

    constructor() {
    }

    ngOnInit() {

    }
}
