import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutEvpComponent } from './about-evp.component';

const routes: Routes = [
  {
    path: '',
    component: AboutEvpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutEvpRoutingModule {}
