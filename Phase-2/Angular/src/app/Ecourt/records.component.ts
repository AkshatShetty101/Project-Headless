import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";
import {AuthService} from "../Shared/auth.service";
import {count} from "rxjs/operator/count";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit, AfterContentChecked{
  records: any[][][];
  fails: any[][];
  norecords: any[][];
  codes: any[];
  disable: boolean = false;
  display: any = false;
  count: any = 0;

  private total_searches : any = 0;

  constructor(
    private logic: LogicService,
    private http: HttpService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.records = this.logic.getRecords();
    this.countCases();
    this.fails = this.logic.getFails();
    this.norecords = this.logic.getNo();
    this.codes = this.logic.getCodes();
    this.total_searches = this.records.length + this.norecords.length;
    if(!this.logic.sent)
      this.sendStats();
    this.logic.recordFlag = true;
    let codes: any[];
    let http: HttpService;
    let router: Router;
    let logic: LogicService;
    logic = this.logic;
    http = this.http;
    codes = this.codes;
    window.onunload = function () {
      logic.recordFlag = false;
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
            logic.returns = true;
            logic.sent = false;
            router.navigateByUrl('/eCourt/input');
          }
        );
    };
  }

  countCases(){
    for(let record of this.records){
      for(let row of record){
        if(row.length != 1)
          this.count++;
      }
    }
  }

  ngAfterContentChecked(){
    this.display = true;
  }

  sendStats(){
    let request: any, token:any;
    token = this.auth.getId('token');
    request = {
      number : this.total_searches
    };
    this.http.deleteCheck(token)
      .subscribe(
        (result) => {
          console.log(result);
          if(result.status == 'x'){
            alert('Your account has been deleted.');
            this.auth.end();
            this.auth.checkStatus();
            this.auth.checkAdmin();
            this.router.navigateByUrl('/home');
          }
          else{
            this.http.sendStats(request, token)
              .subscribe(
                (result) => {
                  this.logic.sent = true;
                }
              );
          }
        }
      );
  }

  view(n: any, data: any){
    this.disable = true;
    let request: any;
    request= {
      code: this.codes[n],
      x: data
    };
    this.http.sendViewData(request)
      .subscribe(
        (data) => {
          this.logic.fillDetails(data.first, data.second, data.third, data.fourth, data.code);
          this.router.navigateByUrl('/eCourt/details');
        }
      );
  }

  done(){
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
          this.logic.returns = true;
          this.logic.sent = false;
          this.router.navigateByUrl('/eCourt/input');
        }
      );
  }
}
