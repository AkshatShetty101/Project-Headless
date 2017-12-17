import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bdetails',
  templateUrl: './bdetails.component.html',
  styleUrls: ['./bdetails.component.css']
})
export class BdetailsComponent implements OnInit {

  data: any;

  constructor(
    private logic: LogicService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.data = this.logic.getBData();
  }

  leave() {
    this.router.navigateByUrl('/eCourt/details');
  }
}
