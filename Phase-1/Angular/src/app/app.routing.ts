import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'eCourt', loadChildren: 'app/Ecourt/ecourt.module#EcourtModule'},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
