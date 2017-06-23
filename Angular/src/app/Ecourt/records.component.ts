import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit {
  records: any[][][];
  codes: any[];

  constructor(
    private logic: LogicService,
    private http: HttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.records = this.logic.getRecords();
    this.codes = this.logic.getCodes();
  }

  view(n: any, data: any){
    let request: any;

    request= {
      code: this.codes[n],
      x: data
    };
    console.log(request);
    this.http.sendViewData(request)
      .subscribe(
        (data) => {
          //console.log(data);
          this.logic.fillDetails(data);
          this.router.navigateByUrl('/eCourt/details');
        }
      );
  }
}
