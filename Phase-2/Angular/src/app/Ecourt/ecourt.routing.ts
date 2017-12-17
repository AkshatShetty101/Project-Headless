import {RouterModule, Routes} from "@angular/router";
import {EcourtComponent} from "./ecourt.component";
import {InputComponent} from "./input.component";
import {RecordsComponent} from "./records.component";
import {DetailsComponent} from "./details.component";
import {ActivateGuard} from "../Shared/activate.guard";
import {DeactivateGuard} from "../Shared/deactivate.guard";
import {BdetailsComponent} from "./bdetails.component";

const ECOURT_ROUTES: Routes = [
  {
    path: '', component: EcourtComponent,  children: [
    {path: '',canActivate:[ActivateGuard],canDeactivate:[DeactivateGuard], component: InputComponent},
    {path: 'input',canActivate:[ActivateGuard],canDeactivate:[DeactivateGuard], component: InputComponent},
    {path: 'records', component: RecordsComponent},
    {path: 'details', component: DetailsComponent},
    {path: 'b_details', component: BdetailsComponent}
  ]
  }
];

export const ecourtRouting = RouterModule.forChild(ECOURT_ROUTES);
