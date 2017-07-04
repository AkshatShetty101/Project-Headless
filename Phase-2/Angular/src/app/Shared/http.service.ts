import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class HttpService {

  constructor(
    private http: Http
  ) { }

  verifyUser(request: any) {
    console.log('Inside Verify');
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/user/login', body, {headers})
      .map((response: Response) => response.json());
  }

  logOut(token: any){
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.get('http://localhost:3000/user/logout', {headers})
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

  terminate(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/release', body, {headers})
      .map((response: Response) => response.json());
  }
  /*registerUser(request: any) {
    console.log("INSIDE");
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/register', body, {headers})
      .map((response: Response) => response.json());
  }

   let character = this.http.get('https://swapi.co/api/people/1').map(res => res.json());
   let characterHomeworld = this.http.get('http://swapi.co/api/planets/1').map(res => res.json());

   Observable.forkJoin([character, characterHomeworld]).subscribe(results => {
   // results[0] is our character
   // results[1] is our character homeworld
   results[0].homeworld = results[1];
   this.loadedCharacter = results[0];
   });
  */

}
