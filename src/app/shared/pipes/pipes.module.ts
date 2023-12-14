import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReplaceEmptyPipe } from './replace-empty.pipe';

const customPipes = [
  ReplaceEmptyPipe,
];

const inbuiltPipes = [
  DatePipe,
  CurrencyPipe
];

const exportable = [
  ...inbuiltPipes,
  ...customPipes
];

@NgModule({
  declarations: customPipes,
  imports: [
    CommonModule
  ],
  exports: exportable,
  providers: inbuiltPipes
})
export class PipesModule { }