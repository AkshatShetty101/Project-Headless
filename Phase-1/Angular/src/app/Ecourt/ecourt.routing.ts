import {RouterModule, Routes} from "@angular/router";
import {EcourtComponent} from "./ecourt.component";
import {InputComponent} from "./input.component";
import {RecordsComponent} from "./records.component";
import {DetailsComponent} from "./details.component";
import {ActivateGuard} from "../Shared/activate.guard";

const ECOURT_ROUTES: Routes = [
  {
    path: '', component: EcourtComponent,  children: [
    {path: '',canActivate:[ActivateGuard], component: InputComponent},
    {path: 'input',canActivate:[ActivateGuard], component: InputComponent},
    {path: 'records', component: RecordsComponent},
    {path: 'details', component: DetailsComponent}
  ]
  }
];

export const ecourtRouting = RouterModule.forChild(ECOURT_ROUTES);
