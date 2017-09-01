import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  username: any;
  adminFlag: any;
  infiFlag: any;
  noSearches: any;
  searchesDuration: any;
  flag: any = 1;
  msg: any = 0;
  choice: any = 0;
  superadmin: any;

  myForm1: FormGroup;
  myForm2: FormGroup;

  constructor(
    private logic: LogicService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router
  ) {
    this.myForm1 = formBuilder.group({
      'password': ['', [Validators.required]],
    });

    this.myForm2 = formBuilder.group({
      'no_searches': ['', [Validators.pattern('^[0-9]+$')]],
      'no_months': ['', [Validators.required]],
      'option': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.username = this.logic.username;
    this.adminFlag = this.logic.admin;
    this.infiFlag = this.logic.searchType;
    this.searchesDuration = this.logic.searchesDuration;
    this.noSearches = this.logic.searchesNumber;
    if(this.auth.getId('superadmin') === 'true')
      this.superadmin = true;
    else
      this.superadmin = false;
  }

  changePassword(data: any){
    let request: any, token: any;
    request = {
      username: this.username,
      password: data.password
    };
    token = this.auth.getId('token');
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
            if(this.superadmin == true){
              this.http.changePassword(request, token, 3)
                .subscribe(
                  (result) => {
                    this.myForm1.reset();
                    this.msg = 1;
                  }
                );
            }
            else{
              this.http.changePassword(request, token, 2)
                .subscribe(
                  (result) => {
                    this.myForm1.reset();
                    this.msg = 1;
                  }
                );
            }
          }
        }
      );
  }

  changeSearches(data: any){
    let request: any, token: any;
    token = this.auth.getId('token');
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
            if(data.option ==  'infinite'){
              data.no_searches = 0;
              data.option = true;
            }
            else{
              data.option = false;
              if(data.no_searches === ""){
                data.no_searches = 0;
              }
            }
            request = {
              username: this.username,
              searchType: data.option,
              searchesNumber: data.no_searches,
              searchesDuration: data.no_months
            };
            this.http.changeSearches(request, token)
              .subscribe(
                (result) => {
                  this.myForm2.reset();
                  this.msg = 1;
                }
              );
          }
        }
      );
  }

  delete(){
    let request: any, token: any;
    token = this.auth.getId('token');
    request = {
      username: this.username
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
            if(this.auth.getId('superadmin') == 'true'){
              this.http.deleteUser(request, token, 3)
                .subscribe(
                  (result) => {
                    this.choice = 0;
                    this.msg = 1;
                    this.router.navigateByUrl('/admin/viewUser');
                  }
                );
            }
            else
            if(this.auth.getId('admin') == 'true'){
              this.http.deleteUser(request, token, 2)
                .subscribe(
                  (result) => {
                    this.choice = 0;
                    this.msg = 1;
                    this.router.navigateByUrl('/admin/viewUser');
                  }
                );
            }
          }
        }
      );
  }
}
