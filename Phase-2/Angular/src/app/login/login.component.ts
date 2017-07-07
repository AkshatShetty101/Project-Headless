import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  flag: any;
  alt: any = 1;
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router
  ) {

    this.myForm = formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if(this.auth.getId('loggedIn') == 'true'){
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit(data: any){
    let request: any;

    this.myForm.reset();
    this.alt = -1;
    request = {
      username: data.username,
      password: data.password
    };
    this.http.verifyUser(request)
      .subscribe(
        (result) => {
          console.log(result);
          this.flag = result.status;
          if(result.status === 1 || result.status === 2 || result.status === 3){
            this.auth.storeId(result.token, 'token');
            this.auth.storeId(true, 'loggedIn');
            if(result.status === 2)
              this.auth.storeId(true, 'admin');
            else
            if(result.status === 3)
              this.auth.storeId(true, 'superadmin');
            this.router.navigateByUrl('/home');
          }
          else
          if(result.status === -2){
            this.auth.storeId(false, 'loggedIn');
          }
          else{
            this.auth.storeId(false, 'superadmin');
            this.auth.storeId(false, 'admin');
            this.auth.storeId(false, 'loggedIn');
          }
          this.auth.checkStatus();
          this.auth.checkAdmin();
        }
      );
  }
}
