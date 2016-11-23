import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-config-part',
    templateUrl: './config-part.component.html',
    styleUrls: ['./config-part.component.css']
})
export class ConfigPartComponent implements OnInit {

    private tabs: [{}] = [{disabled: false}, {
        disabled: false}, { disabled: false}];

    constructor() {
    }

    ngOnInit() {

    }
}
