import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../Shared/http.service";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  default_value:  any;
  flag: any;
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService
  ) {
    this.myForm = formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'no_searches': ['', [Validators.pattern('^[0-9]+$')]],
      'no_months': ['', [Validators.required]],
      'option': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.flag = 1;
    this.default_value = 0;
  }

  onSubmit(data: any){
    let request: any;
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
    console.log(request);
    this.http.addUser(request)
      .subscribe(
        (result) => {
          console.log(result);
          if(result.status == 1){
            this.flag = 3;
            this.myForm.reset();
          }
          else {
            this.flag = -2;
          }
        }
      );
  }
}
