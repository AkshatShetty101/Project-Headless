import {Injectable} from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {InputComponent} from "../Ecourt/input.component";
import {LogicService} from "./logic.service";

@Injectable()
export class DeactivateGuard implements CanDeactivate<InputComponent>{

  constructor(
    private logic: LogicService
  ){}

  canDeactivate(component: InputComponent): Observable<boolean> | Promise<boolean> | boolean {
    return (!this.logic.process);
  }
}
