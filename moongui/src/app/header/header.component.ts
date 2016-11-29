import { Component, OnInit } from '@angular/core';
import {MoonConfigurationService} from "../services/moon-configuration.service";

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

  constructor(private moonConfig:MoonConfigurationService) {

  }

  ngOnInit(){
      this.moonConfig.getTitleSubscribe().subscribe((value)=>{this.title=value;document.title = this.title!=""?"MoonGen - "+this.title:"MoonGen";});
  }

}
