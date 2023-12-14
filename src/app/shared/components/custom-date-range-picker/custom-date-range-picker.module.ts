import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomRangePanelComponent } from './custom-range-panel.component';
import { DatePickerHeaderComponent } from './datepicker-header.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    CustomRangePanelComponent,
    DatePickerHeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CustomRangePanelComponent,
    DatePickerHeaderComponent
  ]
})
export class CustomDateRangePickerModule { }
