import {RouterModule, Routes} from "@angular/router";
import {EcourtComponent} from "./ecourt.component";
import {InputComponent} from "./input.component";
import {RecordsComponent} from "./records.component";

const ECOURT_ROUTES: Routes = [
  {
    path: '', component: EcourtComponent, children: [
    {path: '', component: InputComponent},
    {path: 'input', component: InputComponent},
    {path: 'records', component: RecordsComponent}
  ]
  }
];

export const ecourtRouting = RouterModule.forChild(ECOURT_ROUTES);
