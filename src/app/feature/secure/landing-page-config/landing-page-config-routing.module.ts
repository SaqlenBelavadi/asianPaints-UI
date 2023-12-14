import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { Roles } from '@shared/enums';
import { LeadersTalkComponent } from './leaders-talk/leaders-talk.component';
import { SideNavComponent } from './side-nav/side-nav.component';

const routes: Routes = [
  {
    path: '',
    component: BannerComponent,
  },
  {
    path: 'banner-list',
    data: { roles: [Roles.CADMIN, Roles.ADMIN] },
    component: SideNavComponent,
  },
  {
    path: 'leaders-talk',
    component: LeadersTalkComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageConfigRoutingModule {}
