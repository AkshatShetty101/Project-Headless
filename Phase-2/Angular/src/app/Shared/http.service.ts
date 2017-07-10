import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class HttpService {

  constructor(
    private http: Http
  ) { }

  getStats(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/user/total', {headers})
      .map((response: Response) => response.json());
  }

  addUser(request: any, flag: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(flag == 3){
      return this.http.post('http://localhost:3000/user/registerAdmin', body, {headers})
        .map((response: Response) => response.json());
    }
    else
    if(flag == 2){
      return this.http.post('http://localhost:3000/user/register', body, {headers})
        .map((response: Response) => response.json());
    }
  }

  deleteUser(request: any, token: any, flag: any){
    const body = request;
    let headers = new Headers();
    headers.append('x-access-token', token);
    if(flag == 3){
      return this.http.post('http://localhost:3000/user/removeAdmin', body, {headers})
        .map((response: Response) => response.json());
    }
    else
    if(flag == 2){
      return this.http.post('http://localhost:3000/user/removeUser', body, {headers})
        .map((response: Response) => response.json());
    }
  }

  verifyUser(request: any) {
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/user/login', body, {headers})
      .map((response: Response) => response.json());
  }

  getUsers(token: any, flag: any) {
    let headers = new Headers();
    headers.append('x-access-token', token);
    if(flag == 3){
      return this.http.get('http://localhost:3000/user/getAdmin', {headers})
        .map((response: Response) => response.json());
    }
    else
    if(flag == 2){
      return this.http.get('http://localhost:3000/user/get',{headers})
        .map((response: Response) => response.json());
    }
  }

  getUserDetails(token: any) {
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.get('http://localhost:3000/user/findMe', {headers})
      .map((response: Response) => response.json());
  }

  changeSearches(request: any, token: any){
    const body = request;
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.post('http://localhost:3000/user/updateStatus', body, {headers})
      .map((response: Response) => response.json());
  }

  changePassword(request: any, token: any, flag: any){
    const body = request;
    let headers = new Headers();
    headers.append('x-access-token', token);
    if(flag == 1){
      return this.http.post('http://localhost:3000/user/changePassword', body, {headers})
        .map((response: Response) => response.json());
    }
    else
    if(flag == 2){
      return this.http.post('http://localhost:3000/user/adminChangePassword', body, {headers})
        .map((response: Response) => response.json());
    }
    else{
      return this.http.post('http://localhost:3000/user/superChangePassword', body, {headers})
        .map((response: Response) => response.json());
    }
  }

  logOut(token: any){
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.get('http://localhost:3000/user/logout', {headers})
      .map((response: Response) => response.json());
  }

  checkLimit(token: any){
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.get('http://localhost:3000/user/findStatus', {headers})
      .map((response: Response) => response.json());
  }

  getState(){
    return this.http.get('http://localhost:3000/map/getState')
      .map((response: Response) => response.json());
  }

  getDistrict(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/map/getDistrict', body, {headers})
      .map((response: Response) => response.json());
  }

  getCourt(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/map/getCourt', body, {headers})
      .map((response: Response) => response.json());
  }

  sendMCaptcha(requests: any[]){
    let obj:any[] = new Array(1), i: any;
    for(i=0; i<requests.length; i++){
      obj[i] = this.sendCaptcha(requests[i]);
    }
    return obj;
  }

  sendCaptcha(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/a', body, {headers})
      .map((response: Response) => response.json());
  }

  sendMultipleData(requests: any[]){
    let obj:any[] = new Array(1), i: any;
    for(i=0; i<requests.length; i++){
      obj[i] = this.sendData(requests[i]);
    }
    return obj;
  }

  sendData(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme', body, {headers})
      .map((response: Response) => response.json());
  }

  refreshCaptcha(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/refreshCaptcha', body, {headers})
      .map((response: Response) => response.json());
  }

  getCaptcha(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/invalidCaptcha', body, {headers})
      .map((response: Response) => response.json());
  }

  sendViewData(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/view', body, {headers})
      .map((response: Response) => response.json());
  }

  sendVal(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/map/getNames', body, {headers})
      .map((response: Response) => response.json());
  }

  sendStats(request: any, token: any){
    console.log('Inside decreaseSearches!');
    const body = request;
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.post('http://localhost:3000/user/decreaseSearches', body, {headers})
      .map((response: Response) => response.json());
  }

  terminate(request: any){
    console.log('Inside terminate!');
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/release', body, {headers})
      .map((response: Response) => response.json());
  }
}
