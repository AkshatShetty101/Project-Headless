import {RouterModule, Routes} from "@angular/router";
import {AdminlandingComponent} from "./adminlanding.component";
import {ViewuserComponent} from "./viewuser.component";
const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminlandingComponent ,  children: [
    { path: '', component: ViewuserComponent},
    { path: 'viewUser', component: ViewuserComponent}
  ]
  }
];

export const adminRouting = RouterModule.forChild(ADMIN_ROUTES);
