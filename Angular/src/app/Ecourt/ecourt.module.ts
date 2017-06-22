import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ecourtRouting} from "./ecourt.routing";
import {EcourtComponent} from "./ecourt.component";
import {RecordsComponent} from "./records.component";
import {InputComponent} from "./input.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ecourtRouting
  ],
  declarations: [ EcourtComponent, RecordsComponent, InputComponent]
})
export class EcourtModule { }
