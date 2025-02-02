import { Injectable } from '@angular/core';
import { LocalStorageService } from "angular-2-local-storage";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthService {

  private status = new Subject<any>();
  private admin = new Subject<any>();
  statusEmitted$ = this.status.asObservable();
  adminEmitted$ = this.admin.asObservable();

  constructor(
    private local: LocalStorageService
  ) {}

  end(){
    localStorage.clear();
    console.log('All clear!');
  }

  storeId(code: any, count: any) {
    localStorage.setItem(count ,code);
  }

  getId(count: any) {
    return localStorage.getItem(count);
  }

  checkStatus(){
    if(this.getId('loggedIn') == 'true')
      return this.status.next(true);
    else
      return this.status.next(false);
  }

  checkAdmin(){
    if(this.getId('admin') == 'true' || this.getId('superadmin') == 'true')
      return this.admin.next(true);
    else
      return this.admin.next(false);
  }
}
