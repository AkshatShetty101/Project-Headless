import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  data: any;

  constructor(
   private logic: LogicService,
   private router: Router
  ) { }

  ngOnInit() {
    this.data = this.logic.getDetails();
    console.log(this.data);
  }

  leave(){
    this.router.navigateByUrl('/eCourt/records');
  }
}
