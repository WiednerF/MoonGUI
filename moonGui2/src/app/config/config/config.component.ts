import { Component, OnInit } from '@angular/core';
import {MoonConfigurationService} from "../../services/moon-configuration.service";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  private numberOfPackets:number;

    /**
     * Change the Number of Packets of the Component
     */
    public changeNumberOfPackets($event){
        this.configuration.setPacketNumber($event.target.value);
    }

  constructor(public configuration:MoonConfigurationService) {
      this.numberOfPackets=configuration.getPacketNumber();
  }

  ngOnInit() {
      this.configuration.getPacketNumberSubscribe().subscribe((value)=>{this.numberOfPackets=value});
  }

}
