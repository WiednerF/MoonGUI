import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
/**
 * The Class for the Header Component
 */
export class HeaderComponent implements OnChanges{

  @Input() public title:string = "";//The Title

  constructor() {

  }

  /**
   * Changes the Page title if necessary
   */
  ngOnChanges(changes) {
        document.title = this.title!=""?"MoonGen - "+this.title:"MoonGen";
    }

}
