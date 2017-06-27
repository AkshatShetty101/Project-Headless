import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {RecordsComponent} from "../Ecourt/records.component";

@Injectable()
export class DeactivateGuard implements CanDeactivate<RecordsComponent>{

  constructor(){}

  canDeactivate(component: RecordsComponent): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }
}
