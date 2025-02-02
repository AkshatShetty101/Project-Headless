import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  superadmin: any;
  default_value:  any;
  flag: any;
  flag2: any;
  myForm: FormGroup;
  myForm2: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router
  ) {
    this.myForm = formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'no_searches': ['', [Validators.pattern('^[0-9]+$')]],
      'no_months': ['', [Validators.required]],
      'option': ['', [Validators.required]]
    });
    this.myForm2 = formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.flag = 1;
    this.default_value = 0;
    if(this.auth.getId('superadmin') == 'true'){
      this.superadmin = true;
    }
    else{
      this.superadmin = false;
    }
  }

  onSubmit(data: any){
    let request: any, type: any, token: any;
    token = this.auth.getId('token');
    this.http.changePassword(request, token, 1)
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
            if(this.superadmin == false){
              type = 2;
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
                username: data.username,
                password: data.password,
                searchesNumber: data.no_searches,
                searchType: data.option,
                searchesDuration: data.no_months
              };
            }
            else{
              type = 3;
              request = {
                username: data.username,
                password: data.password,
              };
            }

            this.http.addUser(request, type, token)
              .subscribe(
                (result) => {
                  if(type == 3){
                    if(result.status == 1){
                      this.flag2 = 3;
                      this.myForm2.reset();
                    }
                    else {
                      this.flag2 = -2;
                    }
                  }
                  else{
                    if(result.status == 1){
                      this.flag = 3;
                      this.myForm.reset();
                    }
                    else {
                      this.flag = -2;
                    }
                  }
                }
              );
          }
        }
      );
  }
}
