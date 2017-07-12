import {Component, OnInit} from '@angular/core';
import {LogicService} from "./Shared/logic.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    private logic: LogicService,
    private router: Router
  ){}

  ngOnInit(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.logic.recordFlag = false;
  }
}
