import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../modules/material.module';
import { NoRecordsMessageComponent } from './no-records-message/no-records-message.component';

const exportable = [
  NoRecordsMessageComponent,
];

@NgModule({
  declarations: exportable,
  imports: [
    CommonModule,
    MaterialModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
  ],
  exports: exportable,
})
export class ComponentsModule { }
