import { NgModule } from '@angular/core';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecureLayoutModule } from './secure-layout/secure-layout.module';
import { SecureRoutingModule } from './secure-routing.module';
import { SecureSharedModule } from './secure-shared/secure-shared.module';
import { SecureComponent } from './secure.component';
import { PromotionPosterComponent } from './promotion-poster/promotion-poster.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ExtraActivitiesComponent } from './extra-activities/extra-activities.component';

@NgModule({
  declarations: [
    SecureComponent,
    PromotionPosterComponent,
    ExtraActivitiesComponent
  ],
  imports: [
    SharedModule,
    SecureRoutingModule,
    SecureLayoutModule,
    SecureSharedModule,
    NgIdleModule,
    NgIdleKeepaliveModule
  ]
})
export class SecureModule { }
