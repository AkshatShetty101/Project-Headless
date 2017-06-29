import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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

  default_state: any = '--Select a state--';
  default_district: any = '--Select a district--';
  default_court: any = '--Select a court--';
  s_code: any;
  d_code: any;
  c_code: any = -1;
  ready: any;
  stackname: any;
  stackupper: any;
  stacklower: any;
  submitted: boolean = false;
  flag: any ;
  recaptcha: any;
  count: any = 0;
  opt: any = 0;
  hallpass: any = true;
  crashcount: any = 0;
  secondchances: any = 0;
  returns : any;

  states: any[] = new Array(0);
  state_value: any[] = new  Array(0);
  districts: any[] = new Array(0);
  district_value: any[] = new  Array(0);
  courts: any[] = new Array(0);
  court_value: any[] = new  Array(0);
  captcha: any[] = new Array(1);
  captcha_response: any[] = new Array(1);
  invalid: any[] = new Array(0);
  secondchance: any[] = new Array(0);
  repeat: any[] = new Array(0);

  myForm: FormGroup;
  myCaptcha: FormGroup;
  myCaptchaInvalid: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private http: HttpService,
              private auth: AuthService,
              private router: Router,
              private logic: LogicService) {
    this.myForm = formBuilder.group({
      'name': ['', [Validators.required, Validators.pattern("[^0-9]*")]],
      'year_upper': ['', Validators.compose([Validators.required, Validators.pattern("^[2-9][0-9]{3}$"), this.yearValid.bind(this)])],
      'year_lower': ['', [Validators.required, Validators.pattern("^[2-9][0-9]{3}$")]]
    });
    this.myCaptcha = formBuilder.group({
      'captcha_code': ['', [Validators.required]],
    });
    this.myCaptchaInvalid = formBuilder.group({
      'captcha_code': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.logic.initRecords();
    this.fillState();
    this.returns = this.logic.returns;
    if(this.returns){
      this.requestSender();
    }
  }

  //Select List Functions
  fillState(){
    let i: any;

    this.http.getState()
      .subscribe(
        (data)=>{
          for(i=0; i<data.length; i++){
            this.states[i] = data[i].name;
            this.state_value[i] = data[i].code;
          }
        }
      )
  }

  selectState(data: any){
    this.districts.splice(0, this.districts.length);
    this.district_value.splice(0, this.district_value.length);
    this.courts.splice(0, this.courts.length);
    this.court_value.splice(0, this.court_value.length);
    this.s_code = data;
    this.default_state = '--Select a state--';
    this.default_district = '--Select a district--';
    this.default_court = '--Select a court--';
    this.ready = false;
    this.fillDistrict();
  }

  fillDistrict(){
    let i: any, request: any;
    request = {
      scode: this.s_code
    };
    this.http.getDistrict(request)
      .subscribe(
        (data)=>{
          for(i=0; i<data.length; i++){
            this.districts[i] = data[i].name;
            this.district_value[i] = data[i].code;
          }
        }
      );
  }

  selectDistrict(data: any){
    this.courts.splice(0, this.courts.length);
    this.court_value.splice(0, this.court_value.length);
    this.d_code = data;
    this.default_court = '--Select a court--';
    this.ready = false;
    this.fillCourt();
  }

  fillCourt(){
    let request: any, i: any;
    request ={
      scode: this.s_code,
      dcode: this.d_code
    };
    this.http.getCourt(request)
      .subscribe(
        (data)=>{
           for(i=0; i<data.length; i++){
             this.courts[i] = data[i].name;
             this.court_value[i] = data[i].code;
           }
          this.ready = true;
        }
      );
  }

  selectCourt(data: any){
    this.c_code = data;
    console.log(this.c_code);
    this.ready = true;
  }
  /**********************/
  //Stack Functions
  stackinit(stack: any) {
    let i: any;
    for (i = 0; i < stack.length; i++) {
      stack[i] = -1;
    }
  }

  yearValid(control: FormControl):{[s:string]:boolean} {
    if(!this.myForm){
      return {notValid: true};
    }
    if(control.value < this.myForm.controls['year_lower'].value){
      return {notValid: true};
    }
  }

  push(data: any) {
    this.submitted = true;
    this.stackname = data.name;
    this.stackupper = data.year_upper;
    this.stacklower = data.year_lower;
    this.onSearch();
  }

  printstack(stack: any[]) {
    let i: any;
    for (i = 0; i < stack.length; i++) {
      console.log(stack[i]);
    }
  }

  /***********************************/
  //User Details
  onSearch() {
    //console.log('Submitted');
    let i: any, n: any,ct: any=0, limit: number, no_years: any;
    let request: any[] = new Array(1);
    //console.log(this.stackname);
    //console.log(this.stackupper);
    //console.log(this.stacklower);
    limit = this.stackupper - this.stacklower;
    if(this.c_code === -1){
      for(n= 0; n< this.court_value.length; n++){
        for (i= 0; i <= limit; i++) {
          request[ct++] = {
            name: this.stackname,
            year: (parseInt(this.stacklower) + parseInt(i)).toString(),
            val1: this.s_code,
            val2: this.d_code,
            val3: this.court_value[n]
          };
        }
      }
    }
    else {
      for(n= 0; n< this.court_value.length; n++){
        for (i= 0; i <= limit; i++) {
          request[ct++] = {
            name: this.stackname,
            year: (parseInt(this.stacklower) + parseInt(i)).toString(),
            val1: this.s_code,
            val2: this.d_code,
            val3: this.c_code
          };
        }
      }
    }
    no_years = limit + 1;
    this.logic.fillRequests(request, no_years);
    this.requestSender();
  }

  requestSender(){
    let request: any[] = new Array(0), i: any;
    if(this.logic.requests.length > 0){
      for(i=0; i<this.logic.no_years; i++){
        request[i] = this.logic.requests[i];
      }
      this.logic.requestHandler();
      console.log('Set');
      console.log(request);
      this.repeat = request;
      this.sendMultiple(request);
    }
    else{
      this.logic.returns = false;
      this.router.navigateByUrl('/eCourt/input');
      alert('All Done!Refresh Page.');
    }
  }

  sendMultiple(request: any[]) {
    let obj: any[], i: any, result: any, flag: any = 0;
    obj = this.http.sendMultipleData(request);
    Observable.forkJoin(obj)
      .subscribe(
        results => {
          console.log(results);
          for (i = 0; i < results.length; i++) {
            result = results[i];
            if (result.status === "-5") {
              console.log(result);
              flag = -1;
              break;
            }
            this.pushId(result.code);
            this.pushCaptcha(result.img);
            this.count++;
          }
          if (flag === -1) {
            if (this.crashcount < 2) {
              alert('Timeout!Please be patient.');
              this.crashcount++;
              this.sendMultiple(this.repeat);
            }
            else {
              alert('Refresh Page and try after some time!');
            }
          }
          else {
            this.setCaptcha();
          }
        });
  }

  //Use for Single Post Request
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

  pushCaptcha(data: any) {
    this.captcha[this.count] = data;
  }

  pushId(data: any) {
    this.auth.storeId(data, this.count);
  }

  setCaptcha() {
    this.opt = this.captcha.length - this.count;
    this.flag = true;
  }

  collectCaptcha(data: any) {
    this.captcha_response[this.opt] = data.captcha_code;
    this.flag = false;
    this.count--;
    this.myCaptcha.reset();
    if (this.count != 0)
      this.setCaptcha();
    else {
      this.testCaptcha(this.captcha_response);
    }

  }

  testCaptcha(data: any) {
    let request: any[] = new Array(1), i: any, code: any;
    for (i = 0; i < data.length; i++) {
      code = this.auth.getId(i);
      request[i] = {
        code: code,
        captcha: data[i]
      }
    }

    let obj: any[], result: any, re_request: any;
    obj = this.http.sendMCaptcha(request);
    Observable.forkJoin(obj)
      .subscribe(
        results => {
          console.log(results);
          let n: any = 0;
          for (i = 0; i < results.length; i++) {
            result = results[i];
            if (result.status === "1") {
              this.logic.fillRecords(result.html);
              this.logic.fillCodes(result.code);
            }
            else if (result.status === "2") {
              this.invalid[n++] = result.code;
            }
            else if (result.status === "3") {
              alert('No records!');
            }
            else {
              //console.log(result);
              alert('Timeout');
              re_request = {
                name: result.name,
                year: result.year,
                val1: result.val1,
                val2: result.val2,
                val3: result.val3
              };
              this.secondchance.push(re_request);
            }
          }
          if (this.invalid.length > 0) {
            alert('Invalid Captcha!');
            this.invalidHandler(this.invalid);
          }
          else if (this.secondchance.length > 0) {
            console.log(this.secondchance);
            if(this.secondchances < 2){
              this.sendMultiple(this.secondchance);
            }
            else {
              alert('No hope!');
              for(i=0; i<this.secondchance.length; i++){
                alert('this.secondchance[i].name'+'\n'+'this.secondchance[i].year');
              }
            }

          }
          else if (this.hallpass == true) {
            this.router.navigateByUrl('/eCourt/records');
          }
        });
  }

  invalidHandler(invalid: any[]) {
    if (this.invalid.length !== 0)
      this.getCaptcha(invalid[0]);
    else
      this.router.navigateByUrl('/eCourt/records');
  }

  getCaptcha(code: any) {
    let request: any;
    console.log('Inside Invalid!');
    request = {
      code: code,
    };
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

  testInvalid(data: any) {
    console.log('Inside TestInvalid!');
    let request: any;
    request = {
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

  resultHandler(data: any) {
    if (data.status === "1") {
      this.logic.fillRecords(data.html);
      this.invalid.splice(0, 1);
      this.invalidHandler(this.invalid);
    }
    else if (data.status === "2") {
      alert('Invalid Captcha!');
      this.getCaptcha(data.code);
    }
    else if (data.status === "3") {
      console.log('No records!');
    }
    else {
      alert('Timeout!');
    }
  }

  stackUpdate() {
    this.stackname.splice(0, 1);
    this.stackupper.splice(0, 1);
    this.stacklower.splice(0, 1);
    console.log(this.stackname);
    console.log(this.stackupper);
    console.log(this.stacklower);
  }
}

