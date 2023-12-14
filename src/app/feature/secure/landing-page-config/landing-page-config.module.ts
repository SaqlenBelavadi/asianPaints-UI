import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageConfigRoutingModule } from './landing-page-config-routing.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BannerComponent } from './banner/banner.component';
import { LeadersTalkComponent } from './leaders-talk/leaders-talk.component';
import { YoutubeVideosComponent } from './youtube-videos/youtube-videos.component';
import { VoiceOfChangeComponent } from './voice-of-change/voice-of-change.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PartnerLogosComponent } from './partner-logos/partner-logos.component';
import { CreateTestimonialComponent } from './testimonials/create-testimonial/create-testimonial.component';
import { SharedModule } from '@shared/shared.module';
import { LeadersTalkCreateComponent } from './leaders-talk/leaders-talk-create/leaders-talk-create.component';
import { CreateBannerComponent } from './banner/create-banner/create-banner.component';
import { YtVideosCreateComponent } from './youtube-videos/yt-videos-create/yt-videos-create.component';
import { CreateVoiceOfChangeComponent } from './voice-of-change/create-voice-of-change/create-voice-of-change.component';
import { PartnersLogoCreateComponent } from './partner-logos/partners-logo-create/partners-logo-create.component';


@NgModule({
  declarations: [
    SideNavComponent,
    BannerComponent,
    LeadersTalkComponent,
    YoutubeVideosComponent,
    VoiceOfChangeComponent,
    TestimonialsComponent,
    PartnerLogosComponent,
    CreateTestimonialComponent,
    LeadersTalkCreateComponent,
    CreateBannerComponent,
    YtVideosCreateComponent,
    CreateVoiceOfChangeComponent,
    PartnersLogoCreateComponent
  ],
  imports: [
    CommonModule,
    LandingPageConfigRoutingModule,
    SharedModule
  ]
})
export class LandingPageConfigModule { }
