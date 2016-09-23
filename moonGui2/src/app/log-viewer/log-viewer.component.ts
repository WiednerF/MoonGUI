import { Component, OnInit } from '@angular/core';
import {MoonGenService} from "../services/moon-gen.service";

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
/**
 * This class Generates the Viewer for the Real time log file
 */
export class LogViewerComponent implements OnInit {

  constructor(private moonGenService:MoonGenService) {

  }

  ngOnInit() {
  }

}
