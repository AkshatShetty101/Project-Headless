import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {adminRouting} from "./admin.routing";
import { AdminlandingComponent } from './adminlanding.component';
import { ViewuserComponent } from './viewuser.component';

@NgModule({
  imports: [
    CommonModule,
    adminRouting
  ],
  declarations: [AdminlandingComponent, ViewuserComponent]
})
export class AdminModule { }
