import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {
  records: any[] = new Array(1);
  ct: any = 0;
  constructor() { }

  initRecords(){
    this.records.splice(0,this.records.length) ;
  }
  fillRecords(data: any){
    this.records[this.ct] = data;
    this.ct ++;
  }

  getRecords(){
    this.ct = 0;
    return this.records;
  }
}
