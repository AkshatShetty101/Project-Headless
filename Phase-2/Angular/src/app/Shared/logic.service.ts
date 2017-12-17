import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {
  private records: any[][][] = new Array(0);
  private fails: any[][] = new Array(0);
  private norecords: any[][] = new Array(0);
  private codes: any[];

  sent: any = false;
  admin: any;
  searchType: any;
  username: any;
  searchesNumber: any;
  searchesDuration: any;
  data: any[] = new Array(5);
  bdata: any;
  recordFlag: boolean;
  requests: any[];
  no_years: any;
  returns: any = false;
  process: boolean;

  constructor(

  ) { }

  initRecords(){
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

  fillDetails(data1: any, data2: any, data3: any, data4: any, code: any){
    this.data[0] = data1;
    this.data[1] = data2;
    this.data[2] = data3;
    this.data[3] = data4;
    this.data[4] = code;
  }

  fillBData(data: any){
    this.bdata = data;
  }

  getBData(){
    return this.bdata;
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
