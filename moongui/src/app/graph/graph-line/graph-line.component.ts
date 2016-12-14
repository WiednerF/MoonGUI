import {Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";

declare let Plotly: any;
declare let document: any;

@Component({
    selector: 'app-graph-line',
    templateUrl: './graph-line.component.html'
})
/**
 * Generates a standard graph template for a line graph
 */
export class GraphLineComponent implements OnChanges,AfterViewInit {
    /**
     * The Input for the data points
     */
    @Input() public points: any;
    /**
     * The input for the title of the diagram
     */
    @Input() public title: string;
    /**
     * The Div id, to be used in this view
     */
    @Input() public id: string;
    /**
     * The maximum of entries visible in the graph
     */
    @Input() public max: number;
    /**
     * The Modal for closing and opening for editing of the graph
     */
    @ViewChild('editModal') public editModal: ModalDirective;
    /**
     * The Layout object of the graph, more information can be found in the internet on the Plotly website
     * @type {any}}
     */
    private layout: any = {
        title: this.title,
        bargap: 0.05,
        bargrourgap: 0.2,
        yaxis: {title: "Count"},
        xaxis: {title: "Value", autorange: false, range: [0, 1000000]}
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
    private getElement(): HTMLElement {
        return document.getElementById(this.id);
    }


    ngAfterViewInit() {
        this.element.nativeElement.children[0].setAttribute("id", this.id);//Changes the ID of the DIV for the access for re-layouting the graph
        for (let i: number = 0; i < this.points.length; i++) {//Pushes for each trace
            this.data.push({x: this.points[i].x, y: this.points[i].y, name: this.points[i].title, mode: 'lines',});
        }
        this.layout.title = this.title;//The name of the diagram
        Plotly.newPlot(this.id, this.data, this.layout, {showLink: false, displaylogo: false});//Plot the diagram the first time
    }

    ngOnChanges(changes) {
        if (this.data != [] && this.data.length != 0) {
            let graphDiv: HTMLElement = this.getElement();
            if (changes.points) {//Changes in the points
                let update1: any = {x: [], y: []};
                for (let i: number = 0; i < changes.points.currentValue.length; i++) {
                    update1.x.push(changes.points.currentValue[i].x);
                    update1.y.push(changes.points.currentValue[i].y);
                }
                Plotly.restyle(graphDiv, update1);
                if (changes.points.currentValue.length > 0) {//Changes the range
                    if (changes.points.currentValue[0].x.length > this.max) {
                        this.layout.xaxis.range = [changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - (this.max)], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]];
                        Plotly.relayout(graphDiv, this.layout)
                    } else {
                        this.layout.xaxis.range = [changes.points.currentValue[0].x[0], changes.points.currentValue[0].x[changes.points.currentValue[0].x.length - 1]];
                        Plotly.relayout(graphDiv, this.layout);
                    }
                }
            }

            if (changes.title) {//Changes of the Title
                let update = {
                    title: changes.title.currentValue
                };
                Plotly.relayout(graphDiv, update);
            }
        }
    }

    /**
     * Updates the YAxis title changed in the modal
     * @param $event
     */
    private changeYAxisTitle($event) {
        Plotly.relayout(this.getElement(), {yaxis: {title: $event}});
    }

    /**
     * Updates the XAxis title changed in the modal
     * @param $event
     */
    private changeXAxisTitle($event) {
        this.layout.xaxis.title = $event;
        Plotly.relayout(this.getElement(), this.layout);
    }
}
