import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PageLayoutContentComponent } from './components/page-layout/page-layout-content.component';
import { PageLayoutHeaderComponent } from './components/page-layout/page-layout-header.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';


@NgModule({
  declarations: [
    PageLayoutComponent,
    PageLayoutHeaderComponent,
    PageLayoutContentComponent,
    ImageUploadComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PageLayoutComponent,
    PageLayoutHeaderComponent,
    PageLayoutContentComponent,
  ]
})
export class SecureSharedModule { }
