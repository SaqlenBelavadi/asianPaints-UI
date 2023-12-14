import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-read-more',
  templateUrl: './feedback-read-more.component.html',
  styleUrls: ['./feedback-read-more.component.scss'],
})
export class FeedbackReadMoreComponent {
  constructor(
    public dialogRef: MatDialogRef<FeedbackReadMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
