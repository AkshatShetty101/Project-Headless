import { Component, OnInit } from '@angular/core';
import {HttpService} from "../Shared/http.service";
import {AuthService} from "../Shared/auth.service";

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
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.fillUserList();
  }

  fillUserList(){
    let token: any, i: any;
    token = this.auth.getId('token');
    this.http.getUsers(token)
      .subscribe(
        (result) => {
          console.log(result);
          for(i=0; i<result.length; i++) {
            this.adminFlag.push(result[i].admin);
            this.infiFlag.push(result[i].searchType);
            this.userName.push(result[i].username);
            this.noSearches.push(result[i].searchesNumber);
            this.searchLimit.push(result[i].searchesDuration);
          }
        }
      );
  }
}
