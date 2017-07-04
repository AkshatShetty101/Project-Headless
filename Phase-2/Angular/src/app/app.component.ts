import {Component, OnInit} from '@angular/core';
import {LogicService} from "./Shared/logic.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    private logic: LogicService
  ){}

  ngOnInit(){
    this.logic.recordFlag = false;
  }

}
