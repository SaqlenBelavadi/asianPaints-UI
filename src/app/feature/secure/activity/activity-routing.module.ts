import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { MyHistoryComponent } from './my-history/my-history.component';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
  },
  {
    path: 'activity-detail',
    component: ActivityDetailsComponent,
  },
  {
    path: 'my-history',
    component: MyHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
