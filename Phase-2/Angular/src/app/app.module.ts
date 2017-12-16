import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocalStorageModule} from 'angular-2-local-storage';
import {routing} from "./app.routing";
import {RouterModule} from "@angular/router";
import {HttpService} from "./Shared/http.service";

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import {AuthService} from "./Shared/auth.service";
import {LogicService} from "./Shared/logic.service";
import {DeactivateGuard} from "./Shared/deactivate.guard";
import {ActivateAdmin, ActivateGuard} from "./Shared/activate.guard";
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { MyaccountComponent } from './login/myaccount.component';
import { DevComponent } from './dev.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    MyaccountComponent,
    DevComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    routing,
    RouterModule,
    LocalStorageModule.withConfig({
      prefix: '-app',
      storageType: 'localStorage'
    })
  ],
  providers: [HttpService, AuthService, LogicService, DeactivateGuard, ActivateGuard, ActivateAdmin],
  bootstrap: [AppComponent]
})
export class AppModule { }
