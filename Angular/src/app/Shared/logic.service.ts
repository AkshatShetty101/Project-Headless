import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {
  private records: any[][][];
  private fails: any;
  private codes: any[];
  private data: any;
  recordFlag: boolean;
  requests: any[];
  no_years: any;
  returns: any = false;

  constructor(

  ) { }

  initRecords(){
    this.records = new Array(0);
    this.codes = new Array(0);
    this.fails = new Array(0);
  }

  fillRequests(requests: any[], years: any){
      this.requests = requests;
      this.no_years = years;
  }

  requestHandler() {
    if(this.requests.length > 0){
      this.requests.splice(0, this.no_years);
    }
  }

  fillRecords(data: any[][]){
    this.records.push(data);
  }

  fillFails(data: any){
    this.fails.push(data);
  }

  fillCodes(data: any){
      this.codes.push(data);
  }

  fillDetails(data: any){
    this.data = data;
  }

  getDetails(){
    return this.data;
  }

  getCodes(){
    return this.codes;
  }

  getRecords(){
    return this.records;
  }

  getFails(){
    return this.fails;
  }
}
