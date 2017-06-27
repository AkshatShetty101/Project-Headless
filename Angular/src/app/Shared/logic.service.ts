import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {
  private records: any[][][];
  private codes: any[];
  private data: any;
  recordFlag: boolean;

  constructor() { }

  initRecords(){
    this.records = new Array(0);
    this.codes = new Array(0);
  }

  fillRecords(data: any[][]){
    this.records.push(data);
    console.log(this.records);
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
}
