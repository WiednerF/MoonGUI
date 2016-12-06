var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { ModalDirective } from "ng2-bootstrap";
export var GraphLineComponent = (function () {
    function GraphLineComponent(element) {
        this.element = element;
        this.configuration = { showLink: false, displaylogo: false };
        this.layout = { title: this.title, bargap: 0.05, bargrourgap: 0.2, yaxis: { title: "Count" }, xaxis: { title: "Value", type: "date", autorange: false, range: [0, 1000000] } };
        this.data = [];
    }
    GraphLineComponent.prototype.ngAfterViewInit = function () {
        this.element.nativeElement.children[0].setAttribute("id", this.id);
        for (var i = 0; i < this.points.length; i++) {
            this.data.push({ x: this.points[i].x, y: this.points[i].y, name: this.points[i].title, mode: 'lines', });
        }
        this.layout.title = this.title;
        Plotly.newPlot(this.id, this.data, this.layout, this.configuration);
    };
    GraphLineComponent.prototype.ngOnChanges = function (changes) {
        if (this.data != [] && this.data.length != 0) {
            var graphDiv = document.getElementById(this.id);
            if (changes.points) {
                var update1 = { x: [], y: [] };
                for (var i = 0; i < changes.points.currentValue.length; i++) {
                    update1.x.push(changes.points.currentValue[i].x);
                    update1.y.push(changes.points.currentValue[i].y);
                }
                Plotly.restyle(graphDiv, update1);
                if (changes.points.currentValue.length > 0) {
                    if (changes.points.currentValue[0].x.length > this.max) {
                        this.layout.xaxis.range = [changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - (this.max)], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]];
                        Plotly.relayout(graphDiv, this.layout);
                    }
                    else {
                        this.layout.xaxis.range = [changes.points.currentValue[0].x[0], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]];
                        Plotly.relayout(graphDiv, this.layout);
                    }
                }
            }
            if (changes.title) {
                var update = {
                    title: changes.title.currentValue
                };
                Plotly.relayout(graphDiv, update);
            }
        }
    };
    GraphLineComponent.prototype.changeYAxisTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        Plotly.relayout(graphDiv, { yaxis: { title: $event } });
    };
    GraphLineComponent.prototype.changeXAxisTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        this.layout.xaxis.title = $event;
        Plotly.relayout(graphDiv, this.layout);
    };
    GraphLineComponent.prototype.changeTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        this.layout.title = $event;
        Plotly.relayout(graphDiv, this.layout);
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], GraphLineComponent.prototype, "points", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], GraphLineComponent.prototype, "title", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], GraphLineComponent.prototype, "id", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], GraphLineComponent.prototype, "max", void 0);
    __decorate([
        ViewChild('editModal'), 
        __metadata('design:type', ModalDirective)
    ], GraphLineComponent.prototype, "editModal", void 0);
    GraphLineComponent = __decorate([
        Component({
            selector: 'app-graph-line',
            templateUrl: './graph-line.component.html'
        }), 
        __metadata('design:paramtypes', [ElementRef])
    ], GraphLineComponent);
    return GraphLineComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/graph/graph-line/graph-line.component.js.map