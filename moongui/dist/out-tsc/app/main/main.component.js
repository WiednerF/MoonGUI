var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, HostListener } from '@angular/core';
import { MoonGenService } from "../services/moon-gen.service";
import { Observable } from "rxjs";
import { MoonConnectService } from "../services/moon-connect.service";
import { MoonConfigurationService } from "../services/moon-configuration.service";
export var MainComponent = (function () {
    /**
     * Get the Element for DOM Manipulation
     * @param element
     * @param moonGenService
     * @param connectService
     * @param configuration
     */
    function MainComponent(element, moonGenService, connectService, configuration) {
        var _this = this;
        this.element = element;
        this.moonGenService = moonGenService;
        this.connectService = connectService;
        this.configuration = configuration;
        this.toggle = { output: { status: true }, config: { status: true }, log: { status: true }, graph: { status: true } };
        /**
         * For using to be able to resize the container
         * @type {{horizontal: {size: number; position: number; element: any; bar: any}; vertical: {size: number; position: number; element: any; bar: any}}}
         */
        this.stretch = { horizontal: { size: -1, position: -1, element: null, bar: null }, vertical: { size: -1, position: -1, element: null, bar: null } };
        this.responseData = true;
        this.executionNumber = null;
        /**
         * Graph Configuration
         */
        this.configurationObject = { graph: [] };
        this.pointData = [];
        this.dataCount = 0;
        this.configuration.getWait().subscribe(function (value) {
            if (value) {
                var configurationObject = _this.configuration.getConfiguration(_this.configuration.getScript());
                _this.initScript(configurationObject);
                if (!configurationObject.graph) {
                    configurationObject.graph = [];
                }
                _this.configurationObject = configurationObject;
                _this.configuration.getScriptChange().subscribe(function () { var configurationObject = _this.configuration.getConfiguration(_this.configuration.getScript()); _this.initScript(configurationObject); _this.configurationObject = configurationObject; });
            }
        });
    }
    MainComponent.prototype.initScript = function (configurationObject) {
        if (configurationObject.graph) {
            this.pointData = [];
            for (var i = 0; i < configurationObject.graph.length; i++) {
                if (configurationObject.graph[i].type == "histogram") {
                    if (!configurationObject.graph[i].range) {
                        configurationObject.graph[i].range = { max: 1000000, min: 0, step: 0.00001 };
                    }
                    this.pointData[i] = [];
                    for (var x = 0; x < configurationObject.graph[i].travers.length; x++) {
                        this.pointData[i].push({ x: [], title: configurationObject.graph[i].travers[x].title });
                    }
                }
                else if (configurationObject.graph[i].type == "line") {
                    this.pointData[i] = [];
                    for (var x = 0; x < configurationObject.graph[i].travers.length; x++) {
                        this.pointData[i].push({ x: [], y: [], title: configurationObject.graph[i].travers[x].title });
                    }
                }
            }
        }
        this.dataCount = 0;
    };
    MainComponent.prototype.ngOnInit = function () {
        //INIT For DRAG
        this.stretch.horizontal.element = this.element.nativeElement.children[0];
        this.stretch.horizontal.bar = this.element.nativeElement.children[1];
        this.stretch.vertical.element = this.element.nativeElement.children[2].children[2];
        this.stretch.vertical.bar = this.element.nativeElement.children[2].children[1];
        this.runningData();
    };
    MainComponent.prototype.onMouseUp = function (event) {
        if (this.stretch.horizontal.size != -1) {
            this.dragStop(event, 'horizontal');
        }
        else if (this.stretch.vertical.size != -1) {
            this.dragStop(event, 'vertical');
        }
    };
    MainComponent.prototype.onMouseMove = function (event) {
        if (this.stretch.horizontal.size != -1) {
            this.drag(event, 'horizontal');
        }
        else if (this.stretch.vertical.size != -1) {
            this.drag(event, 'vertical');
        }
    };
    /**
     * Resizing the container
     * @param $event
     * @param type horizontal or vertical
     */
    MainComponent.prototype.drag = function ($event, type) {
        if (type == "horizontal") {
            $(this.stretch.horizontal.element).css('width', this.stretch.horizontal.size + ($event.pageX - this.stretch.horizontal.position) + "px");
        }
        else if (type == "vertical") {
            $(this.stretch.vertical.element).css('height', this.stretch.vertical.size - ($event.y - this.stretch.vertical.position) + "px");
        }
    };
    /**
     * Preparing of the container move
     * @param $event
     * @param type
     */
    MainComponent.prototype.dragStart = function ($event, type) {
        if (type == "horizontal") {
            this.stretch.horizontal.position = $event.pageX;
            this.stretch.horizontal.size = $(this.stretch.horizontal.element).width();
        }
        else if (type == "vertical") {
            this.stretch.vertical.position = $event.y;
            this.stretch.vertical.size = $(this.stretch.vertical.element).height();
        }
    };
    /**
     * Stopping of the container move
     * @param $event
     * @param type
     */
    MainComponent.prototype.dragStop = function ($event, type) {
        if (type == "horizontal") {
            this.stretch.horizontal.position = -1;
            this.stretch.horizontal.size = -1;
        }
        else if (type == "vertical") {
            this.stretch.vertical.position = -1;
            this.stretch.vertical.size = -1;
        }
    };
    /**
     * Open or close the container
     * @param first
     * @param second
     */
    MainComponent.prototype.toggleEvent = function (first, second) {
        if (first.status) {
            second.status = false;
        }
        else {
            first.status = true;
        }
    };
    /**
     * Starts the Process for Fetching Log File
     */
    MainComponent.prototype.runningData = function () {
        var _this = this;
        Observable.interval(1000).subscribe(function () {
            if (_this.moonGenService.getShouldRun() == true) {
                if (_this.executionNumber != _this.moonGenService.getExecutionNumber()) {
                    _this.executionNumber = _this.moonGenService.getExecutionNumber();
                    if (_this.executionNumber != null) {
                        _this.initData();
                        _this.responseData = true;
                    }
                }
                if (_this.responseData) {
                    _this.getData();
                }
            }
        });
    };
    /**
     * Get the Data from external
     */
    MainComponent.prototype.getData = function () {
        var _this = this;
        var data = this.moonGenService.getData(this.dataCount);
        this.responseData = false;
        if (data != null) {
            data.timeout(5000, new Error("Timeout exceeded")).map(function (response) { return response.json(); }).subscribe(function (response) {
                _this.responseData = true;
                var result = response.data;
                if (response.count) {
                    _this.dataCount = response.count;
                }
                if (_this.configurationObject && _this.configurationObject.graph && _this.configurationObject.graph.length != 0) {
                    for (var x = 0; x < _this.configurationObject.graph.length; x++) {
                        if (_this.configurationObject.graph[x].type == "histogram") {
                            for (var y = 0; y < _this.configurationObject.graph[x].travers.length; y++) {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i][_this.configurationObject.graph[x].travers[y].x]) {
                                        _this.pointData[x][y].x.push(result[i][_this.configurationObject.graph[x].travers[y].x]);
                                    }
                                }
                            }
                        }
                        else if (_this.configurationObject.graph[x].type == "line") {
                            for (var y = 0; y < _this.configurationObject.graph[x].travers.length; y++) {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i][_this.configurationObject.graph[x].travers[y].y]) {
                                        _this.pointData[x][y].x.push(result[i][_this.configurationObject.graph[x].travers[y].x]);
                                        _this.pointData[x][y].y.push(result[i][_this.configurationObject.graph[x].travers[y].y]);
                                    }
                                }
                            }
                        }
                        if (result.length > 0) {
                            _this.pointData[x] = JSON.parse(JSON.stringify(_this.pointData[x]));
                        }
                    }
                }
            }, function (error) {
                _this.connectService.addAlert("danger", "Data Error: " + error);
                _this.responseData = true;
            });
        }
    };
    MainComponent.prototype.initData = function () {
        if (this.configurationObject.graph) {
            for (var i = 0; i < this.configurationObject.graph.length; i++) {
                if (this.configurationObject.graph[i].type == "histogram") {
                    if (!this.configurationObject.graph[i].range) {
                        this.configurationObject.graph[i].range = { max: 1000000, min: 0, step: 0.00001 };
                    }
                    this.pointData[i] = [];
                    for (var x = 0; x < this.configurationObject.graph[i].travers.length; x++) {
                        this.pointData[i].push({ x: [], title: this.configurationObject.graph[i].travers[x].title });
                    }
                }
                else if (this.configurationObject.graph[i].type == "line") {
                    this.pointData[i] = [];
                    for (var x = 0; x < this.configurationObject.graph[i].travers.length; x++) {
                        this.pointData[i].push({ x: [], y: [], title: this.configurationObject.graph[i].travers[x].title });
                    }
                }
            }
        }
        this.dataCount = 0;
    };
    __decorate([
        HostListener('mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], MainComponent.prototype, "onMouseUp", null);
    __decorate([
        HostListener('mousemove', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], MainComponent.prototype, "onMouseMove", null);
    MainComponent = __decorate([
        Component({
            selector: 'app-main',
            templateUrl: './main.component.html',
            styleUrls: ['./main.component.css']
        }), 
        __metadata('design:paramtypes', [ElementRef, MoonGenService, MoonConnectService, MoonConfigurationService])
    ], MainComponent);
    return MainComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/main/main.component.js.map