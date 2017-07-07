import {Component, OnInit} from '@angular/core';
import {AuthService} from "../Shared/auth.service";
import {HttpService} from "../Shared/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;
  admin: boolean;

  constructor(
    private auth: AuthService,
    private http: HttpService,
    private router: Router
  ) {
    auth.statusEmitted$.subscribe(
      (status) => {
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
    this.auth.checkStatus();
    this.auth.checkAdmin();
  }

  loginItIs(){
    this.router.navigateByUrl('/login');
  }

  logOut(){
    let token: any;
    token = this.auth.getId('token');
    this.http.logOut(token)
      .subscribe(
        (result) => {
          console.log(result);
          this.auth.end();
          this.auth.checkStatus();
          this.auth.checkAdmin();
          this.router.navigateByUrl('/home');
        }
      );
  }
}
