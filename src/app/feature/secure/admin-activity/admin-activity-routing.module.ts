import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from '@shared/enums/role.enum';
import { AddAdminActivityComponent } from './add-admin-activity/add-admin-activity.component';
import { AdminActivityDetailsComponent } from './admin-activity-details/admin-activity-details.component';
import { PromotionsComponent } from './promotions/promotions.component';

const routes: Routes = [
  {
    path: "",
    component: AdminActivityDetailsComponent
  },
  {
    path: "admin-activity-list",
    component: AdminActivityDetailsComponent,
    data: { roles: [Roles.CADMIN] },
  },
  {
    path: "admin-activity-add",
    component: AddAdminActivityComponent,
    data: { roles: [Roles.CADMIN] },
  },
  {
    path: "promotions",
    component: PromotionsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminActivityRoutingModule { }
