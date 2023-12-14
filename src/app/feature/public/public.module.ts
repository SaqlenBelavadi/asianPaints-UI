import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    LoginComponent,
    PublicComponent,
  ],
  imports: [
    PublicRoutingModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ]
})
export class PublicModule { }
