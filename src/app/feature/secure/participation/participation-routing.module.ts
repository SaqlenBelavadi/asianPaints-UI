import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from '@shared/enums';
import { ParticipationListComponent } from './participation-list/participation-list.component';

const routes: Routes = [
  {
    path: '',
    component: ParticipationListComponent,
  },
  {
    path: 'participation-list',
    data: { roles: [Roles.CADMIN, Roles.EMPLOYEE, Roles.ADMIN] },
    component: ParticipationListComponent,
  },
  {
    path: 'participation-list/:activityId/:activityType',
    component: ParticipationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipationRoutingModule {}
