import { Component, OnInit } from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
/**
 * The Class for the Header Component
 */
export class HeaderComponent implements OnInit{

  public title:string = "";//The Title

  constructor(private moonGen:MoonGenService) {

  }

  ngOnInit(){
      this.moonGen.getTitle().subscribe((value)=>{this.title=value;document.title = this.title!=""?"MoonGen - "+this.title:"MoonGen";});
  }

}
