import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-participation-success',
  templateUrl: './confirm-participation-success.component.html',
  styleUrls: ['./confirm-participation-success.component.scss'],
})
export class ConfirmParticipationSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmParticipationSuccessComponent>
  ) {}
  continue() {
    this.dialogRef.close(true);
  }
}
