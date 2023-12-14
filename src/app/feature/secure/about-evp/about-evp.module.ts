import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutEvpRoutingModule } from './about-evp-routing.module';
import { AboutEvpComponent } from './about-evp.component';


@NgModule({
  declarations: [
    AboutEvpComponent
  ],
  imports: [
    CommonModule,
    AboutEvpRoutingModule
  ]
})
export class AboutEvpModule { }
