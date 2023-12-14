import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { BannerComponent } from './banner/banner.component';



@NgModule({
  declarations: [MenuComponent, BannerComponent],
  imports: [
    CommonModule
  ]
})
export class MenuModule { }
