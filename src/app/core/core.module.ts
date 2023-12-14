import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppLoaderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: true,
      newestOnTop: true,
      enableHtml: true,
      progressBar: true,
      timeOut: 5000,
    }),
  ],
  exports: [AppLoaderComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
