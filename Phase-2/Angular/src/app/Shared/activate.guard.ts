import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LogicService} from "./logic.service";
import {AuthService} from "./auth.service";

@Injectable()
export class ActivateGuard implements CanActivate {

  constructor(
    private logic: LogicService,
    private auth: AuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.getId('loggedIn') == 'true')
      return (!this.logic.recordFlag);
    else{
      this.router.navigateByUrl('/home');
      return (false);
    }
  }
}

@Injectable()
export class ActivateAdmin implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.getId('loggedIn') == 'true'){
      if(this.auth.getId('admin') == 'true' || this.auth.getId('superadmin') == 'true')
        return true;
      else{
        this.router.navigateByUrl('/home');
        return false;
      }
    }
    else{
      this.router.navigateByUrl('/home');
      return (false);
    }
  }
}
