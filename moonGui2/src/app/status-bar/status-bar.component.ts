import { Component, OnInit , Input} from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";
import {MoonConnectServiceService} from "../services/moon-connect-service.service";

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
/**
 * The Class is for Displaying the Status bar in the footer
 */
export class StatusBarComponent implements OnInit {
    /**
     * The Connection Responsible for Checking
     * @type {any}
     */
    private running: boolean = false;//To show running of the Code
    @Input() public status: string = "";//To Show a status string
    @Input() public progressBar: {show : boolean, max: number, value: number};//To show the progressbar with options
    private connectStatus=false;//The connectStatus for template variables

    /**
     * Instantiate of the Status bar
     * @param moonGenService The MoonGenAPI Service
     * @param connectService The Connection Service
     */
  constructor(public moonGenService:MoonGenService,public connectService:MoonConnectServiceService) {

  }

  ngOnInit() {//Check the Sunning Syste,

        this.moonGenService.getRunningSubscribe().subscribe((value)=>this.running=value);
        this.connectService.getConnection().subscribe((value)=>this.connectStatus=value);
      this.connectStatus=this.connectService.getConnectionStart();
  }

}
