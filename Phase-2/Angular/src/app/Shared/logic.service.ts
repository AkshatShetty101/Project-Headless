import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {
  private records: any[][][] = new Array(0);
  private fails: any[][] = new Array(0);
  private norecords: any[][] = new Array(0);
  private codes: any[];

  data: any;
  recordFlag: boolean;
  requests: any[];
  no_years: any;
  returns: any = false;
  process: boolean;

  constructor(

  ) { }

  initRecords(){
    console.log('Logic!');
    this.initialise()
  }

  initialise(){
    this.records = new Array(0);
    this.codes = new Array(0);
    this.fails = new Array(0);
    this.norecords = new Array(0);
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

  fillCodes(data: any){
    this.codes.push(data);
  }

  fillFails(data: any[]){
    this.fails.push(data);
  }

  fillNo(data: any[]){
    this.norecords.push(data);
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

  getNo(){
    return this.norecords;
  }
}
