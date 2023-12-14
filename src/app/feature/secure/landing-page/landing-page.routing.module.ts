import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { ExtraActivitiesComponent } from '../extra-activities/extra-activities.component';


const routes: Routes = [{ path: '', component: LandingPageComponent },
{ path: 'extra-activities', component: ExtraActivitiesComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
