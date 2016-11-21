import {Component, OnInit} from '@angular/core';
import {MoonGenService} from "../../services/moon-gen.service";
import {Response} from "@angular/http";
import {MoonConfigurationService} from "../../services/moon-configuration.service";
import {MoonHistoryService} from "../../services/moon-history.service";

@Component({
  selector: 'app-config-start',
  templateUrl: './config-start.component.html',
  styleUrls: ['./config-start.component.css']
})
export class ConfigStartComponent implements OnInit {
  status = 0;
  private title:string;
  private author:string;
  private script:number;
  private configurationList:any;
  private clearAllValues:boolean=true;
    private save:boolean=true;
    private load:boolean=true;

  constructor(public configurationService:MoonConfigurationService, public moonGenService:MoonGenService, public moonHistory:MoonHistoryService) {
      this.configurationService.getWait().subscribe((value)=>{
         if(value){
             this.configurationList=this.configurationService.getConfigurationList();
             this.script=this.configurationService.getScript();
             this.title=this.configurationService.getTitle();
             this.author=this.configurationService.getAuthor();
         }
      });
  }

  ngOnInit() {
      this.configurationService.getTitleSubscribe().subscribe((value)=>{this.title=value});
      this.configurationService.getAuthorSubscribe().subscribe((value)=>{this.author=value});
      this.moonGenService.getRunningSubscribe().subscribe(value=>{if(value){this.status=1;}else{this.status=0;}});
      this.configurationService.getScriptChange().subscribe(value=>{this.script=value});
  }

  startMoonGen(){
      this.moonGenService.startMoonGen(ConfigStartComponent.startMoonGenResult,this);
  }

  public static startMoonGenResult(result:Response, error:boolean, component:ConfigStartComponent){
        if(error){
            component.status=0;
        }
  }

  stopMoonGen(){
    this.moonGenService.stopMoonGen(ConfigStartComponent.stopMoonGenResult,this);
  }

    public static stopMoonGenResult(result:Response, error:boolean, component:ConfigStartComponent){
        if(error){
            component.status=1;
        }
    }

    /**
     * Change the Title of the Component
     */
    public changeTitle($event){
        this.configurationService.setTitle($event.target.value);
    }
    /**
     * Change the Author of the Component
     */
    public changeAuthor($event){
        this.configurationService.setAuthor($event.target.value);
    }
    /**
     * Change the Script of the Component
     */
    public changeScript($event){
        this.configurationService.setScript($event);
    }
    public clearAll(){
        this.moonHistory.clearAll();
        this.clearAllValues = true;
    }
    public saveFile(){
        let content:string = this.configurationService.getJSONConfiguration();
        ConfigStartComponent.download("moonGUI.json",content);
        this.save = true;
    }
    public loadFile(){
        //TODO Access Through a Modular
        this.load = true;
    }

    private getProbDescription(script:number){
        return this.configurationList[script].description;
    }

    /**
     * Downloads the File to save
     * @param filename The Filename
     * @param text the content
     */
    private static download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

}
