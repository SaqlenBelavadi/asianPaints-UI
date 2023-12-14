import { Component, Inject } from '@angular/core';
import { LocalService } from '@core/services/local-storage.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
@Component({
  selector: 'app-promotion-poster',
  templateUrl: './promotion-poster.component.html',
  styleUrls: ['./promotion-poster.component.scss'],
})
export class PromotionPosterComponent {
  time: any;
  constructor(
    public dialogRef: MatDialogRef<PromotionPosterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private storageService: LocalService
  ) {
    //

    if (this.data.data) {
      let startTime = moment(
        this.data.data.startDate,
        'DD/MM/YYYY hh:mm:ss A'
      ).format('hh:mm a');
      let endTime = moment(
        this.data.data.endDate,
        'DD/MM/YYYY hh:mm:ss A'
      ).format('hh:mm a');
      this.time = `${startTime} - ${endTime}`;
    }
  }

  goToActivityDetail(activity: any) {
    this.dialogRef.close(true);
    const defaultLoc = this.storageService.getData('d-loc') as string;
    this.router.navigate(['/activity/activity-detail'], {
      queryParams: {
        activityId: btoa(activity.activityId),
        location: btoa(defaultLoc),
      },
    });
  }
  returnDateFormated(date: any) {
    return moment(date, 'DD/MM/YYYY hh:mm:ss A').format('Do MMM, YYYY');
  }
}
