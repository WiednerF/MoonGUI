import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit {
    @Input() public connect: boolean = false;
    @Input() public running: boolean = false;
    @Input() public status: string = "";
    @Input() public progressBar: {show : boolean, max: number, value: number};

  constructor() {

  }

  ngOnInit() {
  }

}
