import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "../Shared/auth.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {

  loggedIn: boolean;
  admin: boolean;

  constructor(
    private auth: AuthService,
    private http: HttpService,
    private router: Router
  ) {
    auth.statusEmitted$.subscribe(
      (status) => {
        console.log('Inside Subscribed service '+status);
       this.loggedIn = status;
      }
    );
    auth.adminEmitted$.subscribe(
      (status) => {
        this.admin = status;
      }
    );
  }

  ngOnInit() {
    if(this.auth.getId('loggedIn') == 'true')
      this.loggedIn = true;
    else
      this.loggedIn = false;
    console.log(this.loggedIn);
  }

  ngOnChanges(){
    this.loggedIn = this.auth.isLoggedIn();
    console.log(this.loggedIn);
  }

  logOut(){
    let token: any;
    token = this.auth.getId('token');
    this.http.logOut(token)
      .subscribe(
        (result) => {
          console.log(result);
          this.auth.storeId(false, 'loggedIn');
          this.auth.checkStatus();
          this.router.navigateByUrl('/home');
        }
      );

  }
}
