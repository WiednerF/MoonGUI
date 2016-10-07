import { Component, OnInit } from '@angular/core';
import {MoonConfigurationService} from "../../services/moon-configuration.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  private numberOfPackets:number;
  private interfaceList:any=[];
  private interfaceTx:number=0;
  private interfaceRx:number=1;
    //TODO Add Interface to Config View

    /**
     * Change the Number of Packets of the Component
     */
    public changeNumberOfPackets($event){
        this.configuration.setPacketNumber($event.target.value);
    }

    /**
     * Changes the interface configuration
     * @param $event
     */
    public changeInterfaceTx($event){
        console.log($event);
        this.configuration.setInterfaceTx($event.target.value);
    }

    /**
     * Changes the Interface configuration
     * @param $event
     */
    public changeInterfaceRx($event){
        this.configuration.setInterfaceRx($event.target.value);
    }

    private getInterfaceList(){
        this.getInterfaceListHTTP();
        Observable.interval(100000).subscribe(()=>{
            this.getInterfaceListHTTP();
        });
    }
    private getInterfaceListHTTP(){
        this.configuration.getInterfaceList().map((response)=>response.json()).subscribe((response)=>{
            this.interfaceList=response;
        },(error)=>console.log("Error: "+error));
    }


  constructor(public configuration:MoonConfigurationService) {
      this.numberOfPackets=configuration.getPacketNumber();
      this.interfaceTx=configuration.getInterfaceTx();
      this.interfaceRx=configuration.getInterfaceRx();
  }

  ngOnInit() {
      this.getInterfaceList();
      this.configuration.getPacketNumberSubscribe().subscribe((value)=>{this.numberOfPackets=value});
      this.configuration.getInterfaceTxSubscribe().subscribe((value)=>{this.interfaceTx=value});
      this.configuration.getInterfaceRxSubscribe().subscribe((value)=>{this.interfaceRx=value});
  }

}
