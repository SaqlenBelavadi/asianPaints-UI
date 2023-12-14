import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ImageInDialogComponent } from './image-in-dialog/image-in-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent, ImageInDialogComponent],
  imports: [CommonModule, SharedModule],
  exports: [],
})
export class CommonUIModule {}
