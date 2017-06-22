import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit {
  records: any[];
  constructor(
    private logic: LogicService
  ) { }

  ngOnInit() {
    this.records = this.logic.getRecords();
  }
}
