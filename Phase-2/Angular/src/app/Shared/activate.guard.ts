import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LogicService} from "./logic.service";
import {AuthService} from "./auth.service";

@Injectable()
export class ActivateGuard implements CanActivate {

  constructor(
    private logic: LogicService,
    private auth: AuthService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.getId('loggedIn') == 'true')
      return (!this.logic.recordFlag);
    else
      return (false);
  }
}
