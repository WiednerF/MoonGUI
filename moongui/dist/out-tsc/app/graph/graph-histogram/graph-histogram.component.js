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
export var GraphHistogramComponent = (function () {
    function GraphHistogramComponent(element) {
        this.element = element;
        this.rangeMin = 0;
        this.rangeMax = 1000000000000;
        this.rangeStep = 0.0000001;
        this.xAxisRange = "Automatic";
        this.xAxisPercentile = false;
        this.xAxisPercentileTitle = "Number";
        this.xAxisPercentileValue = 99;
        this.configuration = { showLink: false, displaylogo: false };
        this.layout = { title: this.title, bargap: 0.05, bargroupgap: 0.2, yaxis: { title: "Count" }, xaxis: { title: "Value", autorange: true, range: [10, 50], autosize: true } };
        this.data = [];
    }
    GraphHistogramComponent.prototype.ngAfterViewInit = function () {
        this.element.nativeElement.children[0].children[0].setAttribute("id", this.id);
        for (var i = 0; i < this.points.length; i++) {
            this.data.push({
                name: this.points[i].title,
                x: this.points[i].x,
                type: 'histogram',
                autobinx: false,
                xbins: { start: Math.min.apply(Math, this.points[i].x), end: Math.max.apply(Math, this.points[i].x), size: this.size }
            });
        }
        this.layout.title = this.title;
        Plotly.newPlot(this.id, this.data, this.layout, this.configuration);
    };
    GraphHistogramComponent.prototype.ngOnChanges = function (changes) {
        if (this.data != [] && this.data.length != 0) {
            var graphDiv = document.getElementById(this.id);
            if (changes.points) {
                var update1 = { x: [], xbins: [], name: [] };
                for (var i = 0; i < changes.points.currentValue.length; i++) {
                    update1.name.push(changes.points.currentValue[i].title);
                    update1.x.push(changes.points.currentValue[i].x);
                    update1.xbins.push({
                        start: Math.min.apply(Math, changes.points.currentValue[i].x),
                        end: Math.max.apply(Math, changes.points.currentValue[i].x),
                        size: this.size
                    });
                }
                Plotly.restyle(graphDiv, update1);
                if (this.xAxisPercentile && !this.layout.xaxis.autorange) {
                    this.changeRangePercentile();
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
    GraphHistogramComponent.prototype.changeYAxisTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        Plotly.relayout(graphDiv, { yaxis: { title: $event } });
    };
    GraphHistogramComponent.prototype.changeXAxisTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        this.layout.xaxis.title = $event;
        Plotly.relayout(graphDiv, { xaxis: this.layout.xaxis });
    };
    GraphHistogramComponent.prototype.changeXAxisAutoRange = function ($event) {
        var graphDiv = document.getElementById(this.id);
        this.xAxisRange = $event ? "Automatic" : "Manual";
        this.layout.xaxis.autorange = $event;
        Plotly.relayout(graphDiv, { xaxis: this.layout.xaxis });
    };
    GraphHistogramComponent.prototype.changeXAxisPercentile = function ($event) {
        this.xAxisPercentileTitle = $event ? "Percentile" : "Number";
        this.xAxisPercentile = $event;
        this.changeRangePercentile();
    };
    GraphHistogramComponent.prototype.changeXAxisPercentileRange = function ($event) {
        this.xAxisPercentileValue = $event;
        this.changeRangePercentile();
    };
    GraphHistogramComponent.prototype.changeXAxisRange = function ($event) {
        var graphDiv = document.getElementById(this.id);
        this.layout.xaxis.range = $event;
        var newRange = [this.layout.xaxis.range[0], this.layout.xaxis.range[1]];
        this.layout.xaxis.range = newRange;
        Plotly.relayout(graphDiv, { xaxis: this.layout.xaxis });
    };
    GraphHistogramComponent.prototype.changeXAxisRangeNumber = function ($event, id) {
        var graphDiv = document.getElementById(this.id);
        this.layout.xaxis.range[id] = $event;
        var newRange = [this.layout.xaxis.range[0], this.layout.xaxis.range[1]];
        this.layout.xaxis.range = newRange;
        Plotly.relayout(graphDiv, { xaxis: this.layout.xaxis });
    };
    GraphHistogramComponent.prototype.changeTitle = function ($event) {
        var graphDiv = document.getElementById(this.id);
        Plotly.relayout(graphDiv, { title: $event });
    };
    GraphHistogramComponent.prototype.getPropRange = function (id) {
        return this.layout.xaxis.range[id];
    };
    GraphHistogramComponent.prototype.changeRangePercentile = function () {
        if (this.data[0]) {
            var graphDiv = document.getElementById(this.id);
            var result = this.data[0].x;
            result.sort(function (a, b) { return a - b; });
            this.layout.xaxis.range = [result[0], result[Math.round(result.length * (this.xAxisPercentileValue / 100.0))]];
            Plotly.relayout(graphDiv, { xaxis: this.layout.xaxis });
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], GraphHistogramComponent.prototype, "points", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], GraphHistogramComponent.prototype, "title", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], GraphHistogramComponent.prototype, "size", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], GraphHistogramComponent.prototype, "id", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], GraphHistogramComponent.prototype, "rangeMin", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], GraphHistogramComponent.prototype, "rangeMax", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], GraphHistogramComponent.prototype, "rangeStep", void 0);
    __decorate([
        ViewChild('editModal'), 
        __metadata('design:type', ModalDirective)
    ], GraphHistogramComponent.prototype, "editModal", void 0);
    GraphHistogramComponent = __decorate([
        Component({
            selector: 'app-graph-histogram',
            templateUrl: './graph-histogram.component.html'
        }), 
        __metadata('design:paramtypes', [ElementRef])
    ], GraphHistogramComponent);
    return GraphHistogramComponent;
}());
//# sourceMappingURL=D:/Florian/Documents/Bachelor Informatik/7.Semester/Bachelorarbeit/github/ba-wiedner/webserver/moongui/src/app/graph/graph-histogram/graph-histogram.component.js.map