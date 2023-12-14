import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from '@core/configs/app.config';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { LocalService } from '@core/services/local-storage.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { ComponentBase } from '@shared/abstracts/component-base';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import * as moment from 'moment';
import { PromotionPosterComponent } from './promotion-poster/promotion-poster.component';
import { SharedService } from './secure-shared/service/shared.service';
import { Subscription } from 'rxjs';
import { Roles } from '@shared/enums/role.enum';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss'],
})
export class SecureComponent extends ComponentBase implements OnDestroy {
  defaultLoc: any;
  roleSubscrition: Subscription;
  constructor(
    private idle: Idle,
    private authService: AuthService,
    public sharedService: SharedService,
    private storageService: LocalService,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {
    super();

    const role = this.storageService.getData('Role');
    this.defaultLoc = this.storageService.getData('d-loc');
    if (role === Roles.EMPLOYEE) {
      this.getPromotionDetails();
    }

    //this.watchIdleActivity();

    this.roleSubscrition = this.apiService
      .isProfileSwitched()
      .subscribe((res) => {
        if (res) {
          const role = this.storageService.getData('Role');
          if (role === Roles.EMPLOYEE) {
            this.getPromotionDetails();
          }
        }
      });
  }
  override ngOnDestroy(): void {
    if (this.roleSubscrition) {
      this.roleSubscrition.unsubscribe();
    }
  }

  /* Public Methods */
  initVariables(): void {}

  subscribeEvents(): void {}

  load(): void {
    this.reset();
  }

  unload(): void {}

  /* Private Methods */
  private watchIdleActivity(): void {
    this.idle.setIdle(1); // how long can they be inactive before considered idle, in seconds
    this.idle.setTimeout(60 * AppConfig.auth.idleTimeoutInMinutes); // how long can they be idle before considered timed out, in seconds
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
    // this.idle.onTimeout.subscribe(() => {
    //   this.modalService.showMessage('Time Out').subscribe(() => {
    //     this.authService.logout();
    //   });
    // });
  }

  private reset(): void {
    this.idle.watch();
  }

  hideQuickReply() {
    if (this.sharedService.showKnowledge) {
      // this.sharedService.showKnowledge = false
    }
  }
  getPromotionDetails() {
    const params = new HttpParams().set(
      'searchCriteria',
      `location=${this.defaultLoc}`
    );
    const fetchUrl = `${ActivityAPI.addPromotionUrl()}?${params}`;
    this.apiService.get(fetchUrl).subscribe((res) => {
      if (res) {
        const promotionData =
          res.data.activityPromotion && res.data.activityPromotion.length > 0
            ? res.data.activityPromotion[0]
            : '';
        if (promotionData) {
          //

          let startDate = moment(
            promotionData?.startDate,
            'DD/MM/YYYY hh:mm:ss A'
          ).format('MM/DD/YYYY');
          let endDateDate = moment(
            promotionData?.endDate,
            'DD/MM/YYYY hh:mm:ss A'
          ).format('MM/DD/YYYY');
          let currentdate = moment(new Date(), 'MM/DD/YYYY').format(
            'MM/DD/YYYY'
          );
          //
          //
          //
          if (
            moment(currentdate).isSameOrAfter(moment(startDate)) &&
            moment(currentdate).isSameOrBefore(moment(endDateDate))
          ) {
            this.loadPoster(promotionData);
          }
        }
      }
    });
  }
  loadPoster(data: any) {
    const dialogRef = this.dialog.open(PromotionPosterComponent, {
      width: '844px',
      panelClass: 'dialog-container',
      disableClose: true,
      data: {
        data: data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
