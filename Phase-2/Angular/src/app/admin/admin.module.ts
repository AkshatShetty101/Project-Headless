import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {adminRouting} from "./admin.routing";
import { AdminlandingComponent } from './adminlanding.component';
import { ViewuserComponent } from './viewuser.component';
import { AdduserComponent } from './adduser.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserdetailsComponent } from './userdetails.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    adminRouting
  ],
  declarations: [AdminlandingComponent, ViewuserComponent, AdduserComponent, UserdetailsComponent]
})
export class AdminModule { }
