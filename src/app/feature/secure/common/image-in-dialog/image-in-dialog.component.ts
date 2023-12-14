import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-in-dialog',
  templateUrl: './image-in-dialog.component.html',
  styleUrls: ['./image-in-dialog.component.scss']
})
export class ImageInDialogComponent   {

  url1:any;
  constructor(
    public dialogRef: MatDialogRef<ImageInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.url1=data.url;
  }
  close() {
    this.dialogRef.close(false);
  }


}
