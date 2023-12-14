import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { LandingRoutingModule } from './landing-page.routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { register } from 'swiper/element/bundle';
import { VideoUploadComponent } from './video-upload/video-upload.component';
register();

@NgModule({
  declarations: [LandingPageComponent, VideoUploadComponent],
  imports: [CommonModule, LandingRoutingModule, CarouselModule.forRoot()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageModule {}
