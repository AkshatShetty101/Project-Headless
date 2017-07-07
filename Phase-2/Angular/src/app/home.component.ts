import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "./Shared/http.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  total_searches: any;

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    document.body.style.background = '#202222';
    this.getStats();
  }

  ngOnDestroy() {
    document.body.style.background = 'white';
  }

  getStats(){
    this.http.getStats()
      .subscribe(
        (result) => {
          console.log(result);
          this.total_searches = result.searches;
        }
      );
  }

}
