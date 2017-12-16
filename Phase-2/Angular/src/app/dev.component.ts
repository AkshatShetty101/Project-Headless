import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.css']
})
export class DevComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    document.body.style.background = '#202222';
  }

  ngOnDestroy() {
    document.body.style.background = 'white';
  }
}
