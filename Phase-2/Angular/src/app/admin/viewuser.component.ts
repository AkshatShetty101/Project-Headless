import { Component, OnInit } from '@angular/core';
import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";
import {LogicService} from "../Shared/logic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {
  adminFlag: any[] = new Array(0);
  infiFlag: any[] = new Array(0);
  userName: any[] = new Array(0);
  noSearches: any[] = new Array(0);
  searchLimit: any[] = new Array(0);

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private logic: LogicService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fillUserList();
  }

  fillUserList(){
    let token: any, i: any;
    token = this.auth.getId('token');
    if(this.auth.getId('superadmin') == 'true'){
      this.http.getUsers(token, 3)
        .subscribe(
          (result) => {
            for(i=0; i<result.length; i++) {
              this.adminFlag.push("-NA-");
              this.infiFlag.push("-NA-");
              this.userName.push(result[i].username);
              this.noSearches.push("-NA-");
              this.searchLimit.push("-NA-");
            }
            console.log(this.userName);
          }
        );
    }
    else
    if(this.auth.getId('admin') == 'true'){
      this.http.getUsers(token, 2)
        .subscribe(
          (result) => {
            for(i=0; i<result.length; i++) {
              this.adminFlag.push(result[i].total);
              this.infiFlag.push(result[i].searchType);
              this.userName.push(result[i].username);
              this.noSearches.push(result[i].searchesNumber);
              this.searchLimit.push(result[i].searchesDuration);
            }
          }
        );
    }
  }

  openUser(index: any){
    this.logic.username = this.userName[index];
    this.logic.admin = this.adminFlag[index];
    this.logic.searchType = this.infiFlag[index];
    this.logic.searchesNumber = this.noSearches[index];
    this.logic.searchesDuration = this.searchLimit[index];
    this.router.navigateByUrl('/admin/userDetails');
  }
}
