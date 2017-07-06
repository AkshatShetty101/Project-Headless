import {RouterModule, Routes} from "@angular/router";
import {AdminlandingComponent} from "./adminlanding.component";
import {ViewuserComponent} from "./viewuser.component";
import {AdduserComponent} from "./adduser.component";
import {UserdetailsComponent} from "./userdetails.component";
const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminlandingComponent ,  children: [
    { path: '', component: ViewuserComponent},
    { path: 'viewUser', component: ViewuserComponent},
    { path: 'addUser', component: AdduserComponent},
    { path: 'userDetails', component: UserdetailsComponent}
  ]
  }
];

export const adminRouting = RouterModule.forChild(ADMIN_ROUTES);
