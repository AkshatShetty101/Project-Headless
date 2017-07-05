import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login/login.component";
import {ActivateAdmin, ActivateGuard} from "./Shared/activate.guard";

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'eCourt', canActivate:[ActivateGuard], loadChildren: 'app/Ecourt/ecourt.module#EcourtModule'},
  { path: 'login', component: LoginComponent},
  { path: 'admin', canActivate:[ActivateAdmin], loadChildren: 'app/admin/admin.module#AdminModule'},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
