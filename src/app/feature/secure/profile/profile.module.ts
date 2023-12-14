import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SecureSharedModule } from '../secure-shared/secure-shared.module';
import { ProfileComponent } from './containers/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule,
    SecureSharedModule
  ]
})
export class ProfileModule { }
