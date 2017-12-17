import { Component, OnInit } from '@angular/core';
import {LogicService} from "../Shared/logic.service";
import {Router} from "@angular/router";
import {HttpService} from "../Shared/http.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  data: any[];
  flag: any[] = new Array(4);

  constructor(
   private logic: LogicService,
   private router: Router,
   private http: HttpService
  ) { }

  ngOnInit() {
    this.flag = [0, 0, 0, 0];
    this.data = this.logic.getDetails();
    console.log(this.data);
    if (this.data[0] !== '')
      this.flag[0] = 1;
    if (this.data[1] !== '')
      this.flag[1] = 1;
    if (this.data[2] !== '')
      this.flag[2] = 1;
    if(typeof this.data[3] !== 'undefined')
      this.flag[3] = 1;
    console.log(this.flag);
  }

  viewBusiness(index: any) {
    let request: any;
    console.log(index);
    request = {
      x: index,
      code: this.data[4],
    };
    this.http.viewBusiness(request)
      .subscribe(
        (result) => {
          console.log(result);
          this.logic.fillBData(result);
          this.router.navigateByUrl('/eCourt/b_details');
        }
      );

  }

  leave(){
    this.router.navigateByUrl('/eCourt/records');
  }
}
