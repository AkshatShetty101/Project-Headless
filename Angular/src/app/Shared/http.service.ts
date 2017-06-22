import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class HttpService {

  constructor(
    private http: Http
  ) { }

  sendMCaptcha(requests: any[]){
    let obj:any[] = new Array(1), i: any;
    for(i=0; i<requests.length; i++){
      obj[i] = this.sendCaptcha(requests[i]);
    }
    return obj;
  }
  sendCaptcha(request: any){
    console.log("INSIDE sendCaptcha");
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

  getCaptcha(request: any){
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/supreme/refreshCaptcha', body, {headers})
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
