import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthLoginGuardService } from '@core/guards/auth-login-guard.service';
import { AuthInterceptorProvider } from '@core/interceptors/auth.interceptor';
import { ErrorInterceptorProvider } from '@core/interceptors/error.interceptor';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [AuthLoginGuardService],
    loadChildren: () => import('./feature/public/public.module').then(m => m.PublicModule)
  },
  {
    path: '',
    // canActivate: [],
    loadChildren: () => import('./feature/secure/secure.module').then(m => m.SecureModule),
    data: {
      breadcrumb: 'Home'
    }
  },
  {
    path: '**',
    redirectTo: 'auth/login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule],
  providers: [
    AuthInterceptorProvider,
    ErrorInterceptorProvider
  ]
})
export class AppRoutingModule { }
