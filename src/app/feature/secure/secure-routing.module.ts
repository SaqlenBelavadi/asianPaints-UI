import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@core/guards/auth-guard.service';
import { RoleGuardService } from '@core/guards/role-guard.service';
import { Roles } from '@shared/enums/role.enum';
import { SecureComponent } from './secure.component';

const routes: Routes = [
  {
    path: '',
    component: SecureComponent,
    canActivate: [AuthenticationGuard],
    canActivateChild: [RoleGuardService],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
        data: { roles: [Roles.ADMIN, Roles.CADMIN] },
      },
      {
        path: '',
        loadChildren: () =>
          import('./activity/activity.module').then((m) => m.ActivityModule),
        data: { roles: [Roles.EMPLOYEE] },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { roles: [Roles.ADMIN, Roles.CADMIN] },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        data: { roles: [Roles.ADMIN, Roles.EMPLOYEE, Roles.CADMIN] },
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('./activity/activity.module').then((m) => m.ActivityModule),
        data: { roles: [Roles.ADMIN, Roles.EMPLOYEE, Roles.CADMIN] },
      },
      {
        path: 'landing',
        loadChildren: () =>
          import('./landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
        data: { roles: [Roles.ADMIN, , Roles.EMPLOYEE, Roles.CADMIN] },
      },
      {
        path: 'gallery',
        loadChildren: () =>
          import('./gallery/gallery.module').then((m) => m.GalleryModule),
        data: { roles: [Roles.ADMIN, , Roles.EMPLOYEE, Roles.CADMIN] },
      },
      {
        path: 'participation',
        loadChildren: () =>
          import('./participation/participation.module').then(
            (m) => m.ParticipationModule
          ),
        data: { roles: [Roles.ADMIN, Roles.EMPLOYEE, Roles.CADMIN] },
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
        data: { roles: [Roles.ADMIN, Roles.CADMIN] },
      },
      {
        path: 'admin-activity',
        loadChildren: () =>
          import('./admin-activity/admin-activity.module').then(
            (m) => m.AdminActivityModule
          ),
        data: { roles: ['ROLES_CADMIN', Roles.ADMIN, Roles.CADMIN] },
      },
      {
        path: 'about-evp',
        loadChildren: () =>
          import('./about-evp/about-evp.module').then((m) => m.AboutEvpModule),
        data: { roles: [Roles.EMPLOYEE] },
      },
      {
        path: 'landing-config',
        loadChildren: () =>
          import('./landing-page-config/landing-page-config.module').then(
            (m) => m.LandingPageConfigModule
          ),
        data: { roles: [Roles.ADMIN, Roles.CADMIN] },
      },
      {
        path: '**',
        data: { roles: [Roles.ADMIN, Roles.CADMIN] },
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        data: { roles: [Roles.EMPLOYEE] },
        redirectTo: 'activity',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureRoutingModule {}
