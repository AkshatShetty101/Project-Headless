import {Component, OnInit} from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit{
  records: any[][][];
  codes: any[];
  disable: boolean = false;

  constructor(
    private logic: LogicService,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.records = this.logic.getRecords();
    this.codes = this.logic.getCodes();
    this.logic.recordFlag = true;
    let codes: any[];
    let http: HttpService;
    let router: Router;
    let logic: LogicService;
    logic = this.logic;
    http = this.http;
    router = this.router;
    codes = this.codes;
    console.log(codes);
    window.onbeforeunload = function () {
      return 'please';
    };
    window.onunload = function () {
      logic.recordFlag = false;
      console.log('Leaving');
      let request: any[] = new Array(0), i: any;
      for(i=0; i < codes.length; i++){
        request[i] = {
          code: codes[i]
        };
      }
      http.terminate(request)
        .subscribe(
          (data) => {
            console.log(data);
            router.navigateByUrl('/eCourt');
          }
        );
      return 'please';
    };
  }

  view(n: any, data: any){
    this.disable = true;
    let request: any;
    request= {
      code: this.codes[n],
      x: data
    };
    console.log(request);
    this.http.sendViewData(request)
      .subscribe(
        (data) => {
          this.logic.fillDetails(data);
          this.router.navigateByUrl('/eCourt/details');
        }
      );
  }

  done(){
    console.log('Leaving');
    this.logic.recordFlag = false;
    let request: any[] = new Array(0), i: any;
    for(i=0; i < this.codes.length; i++){
      request[i] = {
        code: this.codes[i]
      };
    }
    this.http.terminate(request)
      .subscribe(
        (data) => {
          console.log(data);
          this.router.navigateByUrl('/eCourt');
        }
      );
  }
}
