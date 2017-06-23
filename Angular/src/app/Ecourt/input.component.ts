import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';

import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";
import {LogicService} from "../Shared/logic.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  myForm: FormGroup;
  myCaptcha: FormGroup;
  myCaptchaInvalid: FormGroup;
  stackname: any[] = new Array(1);
  stackupper: any[] = new Array(1);
  stacklower: any[] = new Array(1);
  k:number = 0;
  flag:any = 0;
  captcha_response: any[] = new Array(1);
  recaptcha: any;
  captcha: any[] = new Array(1);
  //code: any[] = new Array(1);
  count : any = 0;
  opt : any;
  hallpass: any = true;
  invalid: any[] = new Array(0);
  tout: any[] = new Array(0);
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router,
    private logic: LogicService
  ) {
    this.myForm = formBuilder.group({
      'name': ['',[Validators.required, Validators.pattern("[^0-9]*")]],
      'year_upper' : ['',[Validators.required, Validators.pattern("^[2-9][0-9]{3}$")]],
      'year_lower' : ['',[Validators.required, Validators.pattern("^[2-9][0-9]{3}$")]]
    });
    this.myCaptcha = formBuilder.group({
      'captcha_code': ['',[Validators.required]],
    });
    this.myCaptchaInvalid = formBuilder.group({
      'captcha_code': ['',[Validators.required]]
    });
  }

  ngOnInit() {
    this.stackinit(this.stackname);
    this.stackinit(this.stackupper);
    this.stackinit(this.stacklower);
    this.logic.initRecords();
  }

  //Stack Functions
  stackinit(stack:any){
    let i:any;
    for(i=0; i<stack.length; i++){
      stack[i] = -1;
    }
  }

  push(data:any){
    this.stackname[this.k] = data.name;
    this.stackupper[this.k] = data.year_upper;
    this.stacklower[this.k] = data.year_lower;

    // this.printstack(this.stackupper);
    // this.printstack(this.stacklower);
    // this.printstack(this.stackname);
  }

  printstack(stack: any[]){
    let i:any;
    for(i=0; i<stack.length; i++){
        console.log(stack[i]);
    }
  }
  /***********************************/
  //User Details
  onSearch(){
    console.log('Submitted');
    let i: any, limit: number;
    let request: any[] = new Array(1);
    //for(i=0; i<this.stackname.length; i++){
      console.log(this.stackname[0]);
      console.log(this.stackupper[0]);
      console.log(this.stacklower[0]);
      limit = this.stackupper[0]-this.stacklower[0];
      for(i=0; i <= limit; i++){
          request[i] = {
          name : this.stackname[0],
          year : (parseInt(this.stacklower[0]) + parseInt(i)).toString(),
          val1 : "1~Regional Language~0~~~marathi",
          val2 : "37",
          val3 : "119@1,2"
        };
      }
      console.log(request);
      //this.stackUpdate();
      //console.log(this.stackname);
      this.sendMultiple(request);

    // this.sendUserData(request[0]);
    //}
  }
  //"val1":"1~Regional Language~0~~~marathi","val2":"37","val3":"119@1,2","name":"Akshat","year":"2016"}
  sendMultiple(request: any[]){
    let obj : any[], i: any, result: any;
    obj = this.http.sendMultipleData(request);
    Observable.forkJoin(obj)
      .subscribe(
        results => {
          console.log(results);
          //console.log(results[0]);
           for(i=0; i<results.length; i++){
             result = results[i];
             this.pushId(result.code);
             this.pushCaptcha(result.img);
             this.count ++;
           }
           this.flag =1;
           this.setCaptcha();
    });
  }

  sendUserData(request: any) {
    this.http.sendData(request)
      .subscribe(
        (data) => {
          console.log(data.code);
          //this.auth.storeId(data.code);
         // this.setCaptcha(data.img);
        }
      );
  }
  /**************************/
  //Captcha Functions

  pushCaptcha(data: any){
    this.captcha[this.count] = data;
  }

  pushId(data:any){
    console.log(data);
    this.auth.storeId(data,this.count);
  }

  setCaptcha(){
    this.opt = this.captcha.length - this.count;
    //console.log(this.captcha);
    this.flag = 1;
    console.log('Print');
  }

  collectCaptcha(data: any){
    this.captcha_response[this.opt] = data.captcha_code;
    this.flag = 0;
    this.count --;
    if(this.count !=0)
      this.setCaptcha();
    else{
      console.log(this.captcha_response);
      this.testCaptcha(this.captcha_response);
    }

  }
  testCaptcha(data: any){
    //this.captcha_response.splice(0,this.captcha_response.length);
    let request: any[] = new Array(1),i: any, code: any;
    console.log('Inside testCaptcha');
    //console.log(data);
    for(i=0; i<data.length; i++){
      code = this.auth.getId(i);
      //console.log(code);
      request[i] = {
        code : code,
        captcha: data[i]
      }
    }
    console.log(request);

    let obj : any[], result: any;
    obj = this.http.sendMCaptcha(request);
    Observable.forkJoin(obj)
      .subscribe(
        results => {
          console.log(results);
          console.log(this.tout);
          let n: any = 0, m: any = 0;
          for(i=0; i<results.length; i++){
            result = results[i];
            if(result.status === "1"){
              console.log('Records!');
              console.log(result.html[1][2]);
              this.logic.fillRecords(result.html);
            }
            else
            if(result.status === "2"){
              this.invalid[n++] = result.code;
            }
            else
            if(data.status === "3"){
              console.log('No records!');
            }
            else{
              this.tout[m++] = result.code;
            }
          }

          console.log(this.invalid);
          console.log(this.tout);
          console.log(this.hallpass);
          if(this.invalid.length > 0){
            alert('Invalid Captcha!');
            this.invalidHandler(this.invalid);
          }
          else
          if(this.tout.length > 0){
            alert('Timeout!');
            //this.toutHandler(this.tout, request);
          }
          else
          if( this.hallpass == true){
            this.router.navigateByUrl('/eCourt/records');
          }
        });
  }

  invalidHandler(invalid: any[]) {

    if(this.invalid.length !==0)
      this.getCaptcha(invalid[0]);
      //while(this.hallpass == false){
      //  console.log('I');
      //}
      //console.log('Exit');
  }

  toutHandler(tout: any[], requests: any[]){
    let i: any;
    for(i=0; i<tout.length; i++){
      this.requestSearch(tout[i], requests);
    }
  }

  requestSearch(check: any, requests: any[]){
    let j:any, request:any;
    for(j=0; j<requests.length; j++){
      request = requests[j];
      if(check === request.code){

      }
    }
  }
  getCaptcha(code: any) {
    let request : any;
    console.log('Inside Invalid!');
    request = {
      code: code,
    };
    console.log(request);
    this.http.getCaptcha(request)
      .subscribe(
        (data) => {
          console.log(data);
          this.auth.storeId(data.code, 'invalid');
          this.recaptcha = data.img;
          this.hallpass = false;
        }
      );
  }

  testInvalid(data:any){
    console.log('Inside TestInvalid!');
    let request: any;
    request={
      code: this.auth.getId('invalid'),
      captcha: data.captcha_code
    };
    this.http.sendCaptcha(request)
      .subscribe(
        (data) => {
          console.log(data);
          this.resultHandler(data);
        }
      );
  }

  resultHandler(data: any){
    if(data.status === "1"){
      console.log('Records!');
      //this.logic.fillRecords(data.html);
      this.invalid.splice(0,1);
      this.invalidHandler(this.invalid)
    }
    else
    if(data.status === "2"){
      alert('Invalid Captcha!');
      this.getCaptcha(data.code);
    }
    else
    if(data.status === "3"){
      console.log('No records!');
    }
    else{
      alert('Timeout!');
    }
  }

  stackUpdate(){
    this.stackname.splice(0,1);
    this.stackupper.splice(0,1);
    this.stacklower.splice(0,1);
    console.log(this.stackname);
    console.log(this.stackupper);
    console.log(this.stacklower);
  }
}

/*this.http.sendMCaptcha(request)
 .subscribe(
 data => {
 console.log(data.html);
 this.logic.fillRecords(data.html);
 if(data.status === "1"){
 this.router.navigateByUrl('/eCourt/records');
 this.myForm.reset();
 this.stackUpdate();
 }
 else
 if(data.status === "2"){
 alert('Invalid Captcha!');
 this.getCaptcha(code);
 }
 else
 if(data.status === "3"){
 alert('No records found!Enter and submit new name.');
 this.myForm.reset();
 this.stackUpdate();
 }
 else{
 alert('Site Crash!');
 this.onSearch();
 }
 }
 );*/
