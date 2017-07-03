import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LogicService} from "./logic.service";

@Injectable()
export class ActivateGuard implements CanActivate {

  constructor(
    private logic: LogicService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return (!this.logic.recordFlag);
  }
}
