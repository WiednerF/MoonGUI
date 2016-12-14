import {Component, OnInit, ViewChild} from '@angular/core';
import {MoonGenService} from "../../services/moon-gen.service";
import {MoonConfigurationService} from "../../services/moon-configuration.service";
import {MoonHistoryService} from "../../services/moon-history.service";
import {ModalDirective} from "ng2-bootstrap";
import {MoonConnectService} from "../../services/moon-connect.service";

@Component({
    selector: 'app-config-start',
    templateUrl: './config-start.component.html',
    styleUrls: ['./config-start.component.css']
})
/**
 * Defines the View for Configuration and Starting of general purpose and not script related Stuff
 */
export class ConfigStartComponent implements OnInit {
    /**
     * The Status of the MoonGen Process (0 = stopped and 1 = running)
     * @type {number}
     */
    private status:boolean = false;
    /**
     * The Title of the Experiment
     */
    private title: string;
    /**
     * The Number of the selected script
     */
    private script: number;
    /**
     * The ConfigurationList for the GUI
     */
    private configurationList: any;
    /**
     * Status of the button
     * @type {boolean}
     */
    private clearAllValues: boolean = true;
    /**
     * Status of the save Button
     * @type {boolean}
     */
    private save: boolean = true;
    /**
     * Status of the Load Button
     * @type {boolean}
     */
    private load: boolean = true;
    /**
     * Status of the Stop Server Button
     * @type {boolean}
     */
    private stopServerValue: boolean = true;
    /**
     * The Modal for loading for starting and stopping
     */
    @ViewChild('loadFileModal') public loadFileModal: ModalDirective;
    /**
     * The file Information list from the loading process
     * @type {Array}
     */
    private fileInformation:any = [];

    /**
     *
     * @param configurationService The ConfigurationService
     * @param moonGenService The MoonGen process service
     * @param moonHistory The MoonGen history service for cleaning the files
     * @param connect The connect service for the connection to the alert service
     */
    constructor(public configurationService: MoonConfigurationService, public moonGenService: MoonGenService, public moonHistory: MoonHistoryService, public connect: MoonConnectService) {
        this.configurationService.getWait().subscribe((value) => {//Wait for the loading of the application
            if (value) {
                this.configurationList = this.configurationService.getConfigurationList();
                this.script = this.configurationService.getScript();
                this.title = this.configurationService.getTitle();
            }
        });
    }

    ngOnInit() {//Subscribe to the different Values used in this tab
        this.configurationService.getTitleSubscribe().subscribe((value) => {
            this.title = value
        });
        this.moonGenService.getRunningSubscribe().subscribe(value => {
            this.status = !!value;
        });
        this.configurationService.getScriptChange().subscribe(value => {
            this.script = value
        });
    }

    /**
     * Starts the MoonGen Process after activated through the button
     */
    startMoonGen() {
        this.moonGenService.startMoonGen((error:boolean,component:ConfigStartComponent)=>{
            if (error) {
                component.status = false;
            }
        }, this);
    }

    /**
     * Stops the MoonGen Process after activated through the button
     */
    stopMoonGen() {
        this.moonGenService.stopMoonGen((error:boolean,component:ConfigStartComponent)=>{
            if (error) {
                component.status = true;
            }
        }, this);
    }

    /**
     * Change the Title of the Component
     */
    public changeTitle($event) {
        this.configurationService.setTitle($event.target.value);
    }

    /**
     * Change the Script of the Component
     */
    public changeScript($event) {
        this.configurationService.setScript($event);
    }

    /**
     * Clear the Complete History on the server
     */
    public clearAll() {
        this.moonHistory.clearAll();
        this.clearAllValues = true;
    }

    /**
     * Stops the Server directly from the GUI
     */
    public stopServer() {
        this.connect.stopServer();
        this.stopServerValue = true;
    }

    /**
     * Saves the file as Download named moonGUI.json
     */
    public saveFile() {
        let content: string = this.configurationService.getJSONConfiguration();
        ConfigStartComponent.download("moonGUI.json", content);
        this.save = true;
    }

    /**
     * Starts the Dialog to Load a file
     */
    public loadFile() {
        this.loadFileModal.show();
        this.load = true;
    }

    /**
     * At the end of the Loading process, the file is loaded as new configuration
     * @param event
     */
    public loadNewConfiguration(event){
        this.loadFileModal.hide();
        this.readThis(event.target);
    }

    /**
     * Reads a loaded file content
     * @param inputValue
     */
    private readThis(inputValue: any) : void {
        let file:File = inputValue.files[0];
        let myReader:FileReader = new FileReader();
        let config = this.configurationService;

        myReader.onloadend = function(){
            let result = JSON.parse(myReader.result);
            config.setJSONConfiguration(result);
        };

        myReader.readAsText(file);
    }

    /**
     * Gets the Property for the description based on the script number
     * @param script The script number
     * @returns {string }
     */
    private getProbDescription(script: number) {
        return this.configurationList[script].description;
    }

    /**
     * Downloads the File to save
     * @param filename The Filename
     * @param text the content
     */
    private static download(filename, text) {
        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            let event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

}
