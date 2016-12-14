import {Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";

declare let Plotly: any;//Declares the Variables already defined to be usable in the TypeScript Compiler
declare let document: any;

@Component({
    selector: 'app-graph-histogram',
    templateUrl: './graph-histogram.component.html'
})
/**
 * Generates a standard graph template for a histogram based on the Plotly.JS library
 */
export class GraphHistogramComponent implements OnChanges, AfterViewInit {
    /**
     * The Input for the data points
     */
    @Input() public points: any;
    /**
     * The input for the title of the diagram
     */
    @Input() public title: string;
    /**
     * The size of the displayed elements
     */
    @Input() public size: number;
    /**
     * The Div id, to be used in this view
     */
    @Input() public id: string;
    /**
     * All Input parameters to define the range with default values for minimum, maximum and Step
     * @type {number}
     */
    @Input() public rangeMin: number = 0;
    @Input() public rangeMax: number = 1000000000000;
    @Input() public rangeStep: number = 0.0000001;

    /**
     * The View of the Modal for editing
     */
    @ViewChild('editModal') public editModal: ModalDirective;
    /**
     * Writing of the button for change between Manual and automatic
     * @type {string}
     */
    private xAxisRange: string = "Automatic";
    /**
     * The Percentile change value
     * @type {boolean}
     */
    private xAxisPercentile: boolean = false;
    /**
     * The Percentile and number change Button value
     * @type {string}
     */
    private xAxisPercentileTitle: string = "Number";
    /**
     * The Value of the percentile
     * @type {number}
     */
    private xAxisPercentileValue: number = 99;
    /**
     * The Layout object of the graph, more information can be found in the internet on the Plotly website
     * @type {any}}
     */
    private layout: any = {
        title: this.title,
        bargap: 0.05,
        bargroupgap: 0.2,
        yaxis: {title: "Count"},
        xaxis: {title: "Value", autorange: true, range: [10, 50], autosize: true}
    };
    /**
     * The Data object of the graph and all its traces, more information can be found in the internet on the Plotly website
     * @type {Array}
     */
    private data: any = [];

    /**
     *
     * @param element The element reference of this element
     */
    constructor(public element: ElementRef) {
    }

    /**
     * Returns the Element of the HTML page containing the graph
     * @returns {HTMLElement}
     */
    private getElement():HTMLElement{
        return document.getElementById(this.id);
    }

    ngAfterViewInit() {
        this.element.nativeElement.children[0].children[0].setAttribute("id", this.id);//Sets the id for connecting to the div
        for (let i: number = 0; i < this.points.length; i++) {
            this.data.push({//Pushes the data for each trace
                name: this.points[i].title,
                x: this.points[i].x,
                type: 'histogram',
                autobinx: false,
                xbins: {
                    start: Math.min.apply(Math, this.points[i].x),
                    end: Math.max.apply(Math, this.points[i].x),
                    size: this.size
                }
            });

        }
        this.layout.title = this.title;//Setting the layout title
        Plotly.newPlot(this.id, this.data, this.layout, {showLink: false, displaylogo: false});//Plotting the graph initially
    }

    ngOnChanges(changes) {
        if (this.data != [] && this.data.length != 0) {//Only change if data is already defined
            let graphDiv:HTMLElement = this.getElement();
            if (changes.points) {//Changes of the points
                let update1: any = {x: [], xbins: []};
                for (let i: number = 0; i < changes.points.currentValue.length; i++) {
                    update1.x.push(changes.points.currentValue[i].x);//Calculates the changes for each trace again
                    update1.xbins.push({
                        start: Math.min.apply(Math, changes.points.currentValue[i].x),
                        end: Math.max.apply(Math, changes.points.currentValue[i].x),
                        size: this.size
                    });
                }
                Plotly.restyle(graphDiv, update1);//Update and change range of percentile, if wanted
                if (this.xAxisPercentile && !this.layout.xaxis.autorange) {
                    this.changeRangePercentile();
                }
            }

            if (changes.title) {//Changes of the title
                this.layout.title = changes.title.currentValue;
                Plotly.relayout(graphDiv, this.layout);
            }
        }
    }

    /**
     * Redraw the layout after changing the YAxis title
     * @param $event
     */
    private changeYAxisTitle($event) {
        Plotly.relayout(this.getElement(), {yaxis: {title: $event}});
    }

    /**
     * Redraw the layout after changing the XAxis title
     * @param $event
     */
    private changeXAxisTitle($event) {
        this.layout.xaxis.title = $event;
        Plotly.relayout(this.getElement(), {xaxis: this.layout.xaxis});
    }

    /**
     * Change the layout from Automatic to manual or in the other direction
     * @param $event
     */
    private changeXAxisAutoRange($event) {
        this.xAxisRange = $event ? "Automatic" : "Manual";
        this.layout.xaxis.autorange = $event;
        Plotly.relayout(this.getElement(), {xaxis: this.layout.xaxis});
    }

    /**
     * Change the layout from Number to percentile or in the other direction
     * @param $event
     */
    private changeXAxisPercentile($event) {
        this.xAxisPercentileTitle = $event ? "Percentile" : "Number";
        this.xAxisPercentile = $event;
        this.changeRangePercentile();
    }

    /**
     * Change the range of the percentile value
     * @param $event
     */
    private changeXAxisPercentileRange($event) {
        this.xAxisPercentileValue = $event;
        this.changeRangePercentile();
    }

    /**
     * Change the Number of the XAxis range for both values
     * @param $event
     */
    private changeXAxisRange($event) {
        this.layout.xaxis.range = $event;
        this.layout.xaxis.range = [this.layout.xaxis.range[0], this.layout.xaxis.range[1]];
        Plotly.relayout(this.getElement(), {xaxis: this.layout.xaxis});
    }

    /**
     * Change the Number of the XAxis range for one value, defined by the id
     * @param $event
     * @param id
     */
    private changeXAxisRangeNumber($event, id: number) {
        this.layout.xaxis.range[id] = $event;
        this.layout.xaxis.range = [this.layout.xaxis.range[0], this.layout.xaxis.range[1]];
        Plotly.relayout(this.getElement(), {xaxis: this.layout.xaxis});
    }

    /**
     * returns the Property of the Range part defined by the ID
     * @param id the ID
     * @returns {any}
     */
    private getPropRange(id: number) {
        return this.layout.xaxis.range[id];
    }

    /**
     * Recalculates the Percentile Range and Re Layout after change of the number or the data values
     */
    private changeRangePercentile() {
        if (this.data[0]) {
            let result: [number] = this.data[0].x;
            result.sort(function (a, b) {
                return a - b
            });
            this.layout.xaxis.range = [result[0], result[Math.round(result.length * (this.xAxisPercentileValue / 100.0))]];
            Plotly.relayout(this.getElement(), {xaxis: this.layout.xaxis});
        }
    }


}
