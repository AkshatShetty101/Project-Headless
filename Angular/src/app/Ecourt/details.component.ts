import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  data: any;

  constructor(
   private logic: LogicService
  ) { }

  ngOnInit() {
    this.data = this.logic.getDetails();
  }

}
