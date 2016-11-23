import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  private rows = [{id:800,name:"moongen-server.lua",script:"moongen-server.lua",author:"Florian Wiedner",date:"11/19/16 10:29:19"}];
  private selected;


  constructor() { }

  ngOnInit() {
  }

  onSelect($event){
    console.log($event);
    this.selected = $event;
    //TODO
  }

}
