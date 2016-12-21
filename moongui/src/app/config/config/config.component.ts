import { Component, OnInit } from '@angular/core';
import {MoonConfigurationService} from "../../services/moon-configuration.service";
import {Observable} from "rxjs";
import {MoonGenService} from "../../services/moon-gen.service";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
/**
 * This class contains the configuration tab of the MoonGUI software
 */
export class ConfigComponent implements OnInit {
    /**
     * Saves the Information for the script based saving and is designed for exactly one defined object
     * The one example object is saved for reasons of Angular2 if construction, it is not allowed to be complete empty
     * @type any
     */
    private configurationObject:any={};
    /**
     * Saves the list of interfaces available on the testing device
     * @type {Array}
     */
    private interfaceList:any=[];
    /**
     * This part saves the values of the interface selection
     * @type {Array}
     */
    private interfaceNode:any=[];
    /**
     * Saves the values of the input selection defined in the configuration object
     * @type {Array}
     */
    private input:any=[];


    /**
     *
     * @param configuration The Configuration service needed to get all relevant information
     * @param moonGen The Running MoonGen process
     */
  constructor(public configuration:MoonConfigurationService, public moonGen:MoonGenService) {
      this.configuration.getWait().subscribe(value=>{if(value){//Receive, if the configuration is already loaded from the device
          let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());//The Configuration script with the selected object is loaded
          this.initScript(configurationObject);//The script is initiated
          this.configurationObject=configurationObject;
          this.configuration.getScriptChange().subscribe(()=>{let configurationObject=this.configuration.getConfiguration(this.configuration.getScript());this.initScript(configurationObject);this.configurationObject=configurationObject});
          this.configuration.getInterfaceChange().subscribe(value=>{this.interfaceNode[value.id]=value.value});//Subscribe to any changes
          this.configuration.getInputChange().subscribe(value=>{this.input[value.id]=value.value});
      }});
  }

    /**
     * Initiates a new script with the variables in the different objects before overwriting the original object
     * @param configurationObject The configurationObject used
     */
  private initScript(configurationObject){
      if(configurationObject.configuration){
          if(configurationObject.configuration.interfaces){
              this.interfaceNode=[];
              for(let i:number=0;i<configurationObject.configuration.interfaces.length;i++){
                  this.interfaceNode.push(this.configuration.getInterface(i));
              }
          }
          if(configurationObject.configuration.input){
              this.input=[];
              for(let i:number=0;i<configurationObject.configuration.input.length;i++){
                  this.input.push(this.configuration.getInput(i));
              }
          }
      }
  }

  ngOnInit() {
      this.getInterfaceList();//Collects the interface list from the server
  }

    /**
     * Receives the Interface List from the server and handles errors in receiving them
     */
    private getInterfaceList(){
        let interfaceListHTTP=this.configuration.getInterfaceList();
        if(interfaceListHTTP!=null) {
            this.configuration.getInterfaceList().map((response)=>response.json()).subscribe((response)=> {
                this.interfaceList = response;
            }, (error)=>{console.log("Error: " + error);
                Observable.interval(100000).take(1).subscribe(()=>{
                    this.getInterfaceList();
                });
            });
        }else{
            Observable.interval(100000).take(1).subscribe(()=>{
                this.getInterfaceList();
            });
        }
    }
    /**
     * Changes the Interface configuration
     * @param $event
     * @param id
     */
    public changeInterface($event,id){
        this.configuration.setInterface(id,$event);
        this.interfaceNode[id]=$event;
    }
    /**
     * Changes the Input configuration
     * @param $event
     * @param id
     */
    public changeInput($event,id){
        this.configuration.setInput(id,$event);
        this.input[id]=$event;
    }

    /**
     * Changes the Input configuration for the Range Slider
     * @param $event
     * @param id
     */
    public changeRangeInput($event:number,id){
        let temp:number = Number($event);
        this.configuration.setInput(id,temp);
        this.input[id]=temp;
    }

    /**
     * Activates the Push from the button
     * @param i The parameter of the config
     */
    public buttonAction(i){
        this.moonGen.buttonAction(this.configurationObject.configuration.input[i].parameter);
    }

    /**
     * Get the Property directly
     * Is needed for the ngModel directive because of internal reasons
     * @param name The name of the Property
     * @param id The Id of the Property in the internal array
     * @returns {any}
     */
    private getProp(name:string,id:number){
        return this[name][id];
    }


}
