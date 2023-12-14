import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CommonUIModule } from '../common/commonUI.module';
import { SecureSharedModule } from '../secure-shared/secure-shared.module';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AppFilterLayoutComponent } from './app-filter-layout/app-filter-layout.component';
import { CustomDateRangePickerModule } from '@shared/components/custom-date-range-picker/custom-date-range-picker.module';
import { MultiSelectSearchComponent } from './multi-select-search/multi-select-search.component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppFilterLayoutComponent,
    MultiSelectSearchComponent,

  ],
  imports: [
    SharedModule,
    RouterModule,
    SecureSharedModule,
    CommonUIModule,
    CustomDateRangePickerModule
  ],
  exports: [
    AppLayoutComponent,
  ]
})
export class SecureLayoutModule { }
