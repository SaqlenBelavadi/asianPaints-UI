
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMatModalModule } from '@vslabs/ngx-mat-modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { ModulesModule } from './modules/modules.module';
import { PipesModule } from './pipes/pipes.module';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const exportable = [
  ComponentsModule,
  DirectivesModule,
  ModulesModule,
  PipesModule,
  PerfectScrollbarModule,
  NgxMatModalModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  MatMomentDateModule,
  NgxMatMomentModule,
];

@NgModule({
  imports: exportable,
  exports: exportable,
  providers: [DatePipe, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class SharedModule { }
