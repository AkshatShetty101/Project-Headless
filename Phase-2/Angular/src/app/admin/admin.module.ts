import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {adminRouting} from "./admin.routing";
import { AdminlandingComponent } from './adminlanding.component';
import { ViewuserComponent } from './viewuser.component';
import { AdduserComponent } from './adduser.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    adminRouting
  ],
  declarations: [AdminlandingComponent, ViewuserComponent, AdduserComponent]
})
export class AdminModule { }
