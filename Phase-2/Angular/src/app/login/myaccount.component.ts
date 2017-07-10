import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../Shared/auth.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {

  username: any;
  adminFlag: any;
  infiFlag: any;
  noSearches: any;
  searchesDuration: any;
  superadmin: any;
  choice: any;
  flag: any;
  total: any;

  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private http: HttpService,
    private router: Router
  ) {
    this.myForm = formBuilder.group({
      'password' :['',[Validators.required]]
    });
  }

  ngOnInit() {
    this.fillUser();
    if(this.auth.getId('superadmin') === 'true'){
      this.superadmin = true;
      this.adminFlag = false;
    }
    else{
      this.superadmin = false;
      if(this.auth.getId('admin') === 'true')
        this.adminFlag = true;
      else
        this.adminFlag = false;
    }
  }

  fillUser(){
    let token: any;
    token = this.auth.getId('token');
    this.http.getUserDetails(token)
      .subscribe(
        (result) => {
          this.infiFlag = result.searchType;
          this.username = result.username;
          this.noSearches = result.searchesNumber;
          this.searchesDuration = result.searchesDuration;
          this.total = result.total;
        }
      );
  }

  onSubmit(data: any){
    let request: any, token: any;
    token = this.auth.getId('token');
    request ={
      password: data.password
    };
    this.http.changePassword(request, token, 1)
      .subscribe(
        (result) => {
          console.log(result);
          this.myForm.reset();
          this.flag = 1;
          this.router.navigateByUrl('/home');
        }
      );
  }
}
