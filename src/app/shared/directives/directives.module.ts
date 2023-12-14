import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AllowOnlyAlphabetsDirective } from './allow-only-alphabets.directive';
import { AllowOnlyNumbersDirective } from './allow-only-numbers.directive';
import { BackButtonDirective } from './back-button.directive';
import { DebounceClickDirective } from './debounce-click.directive';
import { DecimalNumberDirective } from './decimal-number.directive';
import { DisabledDirective } from './disabled.directive';
import { DisplayNoneDirective } from './display-none.directive';
import { DragDirective } from './file-drag-drop.directive';
import { FullScreenDirective } from './full-screen.directive';
import { MarkIfRequiredDirective } from './mark-if-required.directive';

const exportable = [
  AllowOnlyNumbersDirective,
  AllowOnlyAlphabetsDirective,
  DragDirective,
  BackButtonDirective,
  DisabledDirective,
  DecimalNumberDirective,
  DisplayNoneDirective,
  FullScreenDirective,
  MarkIfRequiredDirective,
  DebounceClickDirective
];

@NgModule({
  declarations: exportable,
  imports: [
    CommonModule
  ],
  exports: exportable
})
export class DirectivesModule { }
