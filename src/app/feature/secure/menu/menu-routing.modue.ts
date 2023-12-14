import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './banner/banner.component';

// Import other components

const routes: Routes = [
  { path: 'banners', component: BannerComponent },

  { path: '', redirectTo: '/banners', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }