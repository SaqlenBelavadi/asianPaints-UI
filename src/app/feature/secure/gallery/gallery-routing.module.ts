import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component'

const routes: Routes = [
  {
    path: "",
    component: GalleryDetailsComponent
  },
  {
    path: "gallery-list",
    component: GalleryDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
