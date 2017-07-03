import { Injectable } from '@angular/core';
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class AuthService {

  constructor(
    private local: LocalStorageService
  ) { }

  storeId(code: any, count: any) {
    localStorage.setItem(count ,code);
  }

  getId(count: any) {
    return localStorage.getItem(count);
  }
}
