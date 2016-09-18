import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() public title:string = "";

  constructor() {

  }
  ngOnChanges() {
        document.title = this.title!=""?"MoonGen - "+this.title:"MoonGen";
    }

}
