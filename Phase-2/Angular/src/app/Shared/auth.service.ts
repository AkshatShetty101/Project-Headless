import { Injectable } from '@angular/core';
import { LocalStorageService } from "angular-2-local-storage";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthService {

  private status = new Subject<any>();
  statusEmitted$ = this.status.asObservable();

  constructor(
    private local: LocalStorageService
  ) {}

  isLoggedIn(){
    if(this.getId('loggedIn') == 'true')
      return true;
    else
      return false;
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
}
