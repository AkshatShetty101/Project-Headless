import { Injectable } from '@angular/core';
import {Record, row} from './records';
@Injectable()
export class LogicService {
  records: Record[];
  ct: any = 0;
  constructor() { }

  initRecords(){
    this.records = new Array(0);
    this.records['rows'] = new Array(0);

    this.records[this.ct]['rows']
  }

  fillRecords(data: any[][]){
    //console.log(this.records);
    let i: any , j: any, row: any, element: any;
    // for(row in this.records[this.ct]){
    //   data = datas[i];
    //   j = 0;
    //   for(element in row){
    //     element = data[j];
    //     j++;
    //   }
    //   i++;
    // }
    for(i=0; i< data[i].length; i++){
      for(j=0; j<data[i].length; j++){
        console.log(data[i][j]);
        this.records[this.ct].rows[i].elements[j] = data[i][j];
      }
    }
    //console.log(this.records);
    this.ct ++;
    //this.records = data;
  }

  getRecords(){
    this.ct = 0;
    return this.records;
  }
}
