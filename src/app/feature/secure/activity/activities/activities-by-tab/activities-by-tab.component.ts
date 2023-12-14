import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { Roles } from '@shared/enums/role.enum';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../../common/confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationComponent } from '../../../common/delete-confirmation/delete-confirmation.component';
import { AddActivityComponent } from '../../add-activity/add-activity.component';
import { AddFeedbackComponent } from '../../add-feedback/add-feedback.component';
import { ConfirmParticipationSuccessComponent } from '../../confirm-participation-success/confirm-participation-success.component';

enum FileTypes {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  INVALID = 'INVALID',
}

@Component({
  selector: 'app-activities-by-tab',
  templateUrl: './activities-by-tab.component.html',
  styleUrls: ['./activities-by-tab.component.scss'],
})
export class ActivitiesByTabComponent implements OnInit, OnDestroy {
  @Input() selectedTabIndex: number;
  @Input() isHistory: boolean;
  sideOverlayData: any;
  role: any;
  activtySearchParam: any;

  activityDetails: any[] = [];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 3;
  coverImage: any;
  employeeId: any;
  globalSearchCriteria: any;
  fileTypes = FileTypes;
  subScription: Subscription;
  defaultLocation: any;
  feedbackCloseSubscription: Subscription;
  constructor(
    private _overlaySidePanelService: OverlaySidePanelService,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
    private toastr: ToastrService,
    private filterService: AppFilterService,
    private pagerService: PagerService,
    private storageService: LocalService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  roles: Roles;

  public get roleEnum(): typeof Roles {
    return Roles;
  }

  ngOnInit(): void {
    this.role = this.storageService.getData('Role');
    if (this.storageService.getData('d-loc')) {
      this.defaultLocation = this.storageService.getData('d-loc') as string;
    }

    this.apiService.isProfileSwitched().subscribe((res: any) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      //
      this.employeeId = params?.empId ? atob(params?.empId) : '';
    });

    this.subScription = this.filterService
      .getdrpdwnValues()
      .subscribe(async (filters: any) => {
        // update component based on the changes in filters object
        if (
          filters &&
          (this.apiService.currentRouteUrl == '/activity/activities' ||
            this.apiService.currentRouteUrl == '/activity' ||
            this.apiService.currentRouteUrl.includes('/activity'))
        ) {
          this.globalSearchCriteria = filters;
          this.currentPage = 1;
          if (this.employeeId) {
            this.fetchActivity();
          } else {
            this.fetchActivity();
          }
        }
      });
    this.feedbackCloseSubscription =
      this.apiService.feedbackPanelClose$.subscribe((res: any) => {
        console.log('in list');
        if (res.status) {
          const dialogRef = this.dialog.open(
            ConfirmParticipationSuccessComponent
          );
          dialogRef.afterClosed().subscribe((status: any) => {
            if (status) {
              this.fetchActivity();
            }
          });
        }
      });
  }
  ngOnDestroy(): void {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
    if (this.feedbackCloseSubscription) {
      this.feedbackCloseSubscription.unsubscribe();
    }
  }

  selectedActivity(val: any) {
    
    switch (this.selectedTabIndex) {
      case 0:
        this.activityDetails = val.data.ongoingActivities.ongoingActivities;
        this.totalItems = val.data.ongoingActivities.totalElements
          ? val.data.ongoingActivities.totalElements
          : 0;
        this.setPage(this.currentPage);
        break;

      case 1:
        this.activityDetails = val.data.upcomingActivities.upcomingActivities;
        this.totalItems = val.data.upcomingActivities.totalElements
          ? val.data.upcomingActivities.totalElements
          : 0;

        this.setPage(this.currentPage);
        break;
      case 2:
        this.activityDetails = val.data.pastActivities.pastActivities;
        this.totalItems = val.data.pastActivities.totalElements
          ? val.data.pastActivities.totalElements
          : 0;

        this.setPage(this.currentPage);
        break;
      case 3:
        this.activityDetails = val.data.createdActivities.createdActivities;
        this.totalItems = val.data.createdActivities.totalElements
          ? val.data.createdActivities.totalElements
          : 0;

        this.setPage(this.currentPage);
        break;
      default:
        this.selectedTabIndex = 0;
        this.activityDetails = val.data.ongoingActivities.ongoingActivities;
        this.totalItems = val.data.ongoingActivities.totalElements
          ? val.data.ongoingActivities.totalElements
          : 0;

        this.setPage(this.currentPage);
        break;
    }
  }

  setPage(page: number) {
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.activityDetails && this.activityDetails.length
        ? this.activityDetails.length
        : 0,
      page,
      3
    );
    this.currentPage = page;

    // get current page of items
    this.pagedItems = this.activityDetails;

    //
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.fetchActivity();
    }
  }

  goToActivityDetail(activity: any) {
    if (this.isHistory) {
      this.router.navigate(['/activity/activity-detail'], {
        queryParams: {
          activityId: btoa(activity.activityId),
          activityUUID: btoa(activity.activityUUID),
          location: btoa(activity.activityLocation),
          h: btoa('true'), // h is for history
          state: btoa('2'), // for history past tab is considering
        },
      });
    } else {
      this.router.navigate(['/activity/activity-detail'], {
        queryParams: {
          activityId: btoa(activity.activityId),
          activityUUID: btoa(activity.activityUUID),
          location: btoa(activity.activityLocation),
          state: btoa(this.selectedTabIndex.toString()),
        },
      });
    }
  }

  fetchActivity() {
    if (this.employeeId) {
      this.activtySearchParam = `${this.globalSearchCriteria}:employeeId=${this.employeeId}`;
    } else {
      this.activtySearchParam = this.globalSearchCriteria;
    }
    const params = new HttpParams()
      .set('searchCriteria', this.activtySearchParam.toString().trim())
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);
    const fetchUrl = `${ActivityAPI.getActivityUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val: {
        data: {
          employeeActivityHistoryResponse: {
            activities: any[];
            totalElements: number;
          };
        };
      }) => {
        
        if (val.data) {
          // this.createdActivities = val.data.createdActivities.createdActivities;
          // this.ongoingActivities = val.data.ongoingActivities.ongoingActivities;
          // this.pastActivities = val.data.pastActivities.pastActivities;
          // this.upcomingActivities = val.data.upcomingActivities.upcomingActivities;
          if (this.employeeId) {
            this.activityDetails =
              val.data.employeeActivityHistoryResponse.activities;
            this.totalItems =
              val.data.employeeActivityHistoryResponse.totalElements;

            this.setPage(this.currentPage);
          } else {
            this.selectedActivity(val);
          }
        }
      },
      error: () => {
        // this.toastr.error(err) ;
      },
      complete: () => {
        //
      },
    });
  }

  delete(activityId: any, activityName: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',

      // width: '844px', promotion
      // panelClass: 'dialog-container',

      data: {
        heading: 'Delete Activity?',
        message: `Are you sure you want to delete the activity ${activityName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const params = new HttpParams().set(
          'activityNameOrUUID=activityUUID',
          activityId.toString().trim()
        );

        this.communicationService
          .delete(
            `${ActivityAPI.ActivityUrl()}/?${params.toString()}`,
            {},
            true
          )
          .subscribe({
            next: () => {
              this.toastr.success('Activity Deleted');
              this.fetchActivity();
            },
            error: (err: { error: { message: string | undefined } }) => {
              this.toastr.error(err.error.message);
            },
            complete: () => {},
          });
      }
    });
  }
  // editActivity(data: any) {
  //   this.sideOverlayData.isEdit = true;
  //   this._overlaySidePanelService.setContent(AddActivityComponent);
  //   this._overlaySidePanelService.show();
  //   this.apiService.isActivityEdit = true;
  //   this.apiService.ativityEditData = data;
  // }

  editActivity(data: any, type: any) {
    if (type == 'past') {
      this.apiService.isPastActivityEdit = true;
      // this.apiService.activityEditFromList$.next(true);
    }
    if (type == 'ongoing') {
      this.apiService.isOngoingActivityEdit = true;
      // this.apiService.activityEditFromList$.next(true);
    }
    const params = new HttpParams().set(
      'searchCriteria',
      `activityUUID=${data.activityUUID}`.toString().trim()
    );
    const fetchUrl = `${ActivityAPI.getActivityUrl()}?${params} `;
    
    this.apiService.get(fetchUrl).subscribe({
      next: (val: any) => {
        
        if (val.data) {
          this.apiService.isActivityEdit = true;
          this.apiService.ativityEditData = val.data.activity;
          this._overlaySidePanelService.setContent(AddActivityComponent);
          this.apiService.activityEditFromList$.next(true);
          this._overlaySidePanelService.show();
        }
      },
      error: (err: { error: { message: string | undefined } }) => {
        this.toastr.error(err.error.message);
        if (type == 'past') {
          this.apiService.isPastActivityEdit = false;
        }
      },
      complete: () => {
        //
      },
    });
  }

  returnDate(date: any) {
    return moment(date, 'DD/MM/YYYY').format('D MMM');
  }

  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

  enrollnow(
    activityUUID: any,
    activityName: any,
    activityLocation: any,
    activityId: string
  ) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Enroll Activity?',
        message: `Are you sure you want to Enroll the activity ${activityName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        let subInfo = JSON.parse(this.storageService.getData('sub-info'));
        const url = this.returnActivityLinkUrl({
          activityUUID: activityUUID,
          activityId: activityId,
        });
        const body = {
          employeeId: subInfo.employeecode,
          activityUuid: activityUUID,
          enrolledOrParticipate: 'Enrolled',
          location: activityLocation,
          activityUrl: url,
        };
        this.apiService
          .post(body, ActivityAPI.activityEnrollOrParticipateUrl())
          .subscribe({
            next: () => {
              this.toastr.success('Activity Enrolled Successfully');
              this.fetchActivity();
            },
            error: (err: { error: { message: string | undefined } }) => {
              this.toastr.error(err.error.message);
            },
            complete: () => {},
          });
      }
    });
  }

  confirmParticipation(item: any) {
    // this.sideOverlayData = {
    //   width: '750',
    //   label: 'Add Feedback',
    //   isEdit: false,
    //   data: {},
    // };

    const details = {
      activityId: item.activityId,
      activityName: item.activityName,
      location: item.activityLocation,
      themeName: item.themeName,
      tagName: item.tagName,
      startDate: item.startDate,
      endDate: item.endDate,
      mode: item.modeOfParticipation,
      timeRequired: item.timeRequired,
    };
    // this.sideOverlayData.isEdit = false;
    this.apiService.feedbackAddData = details;
    this._overlaySidePanelService.setContent(AddFeedbackComponent);
    this.apiService.activityConfrimParticipationList$.next(true);
    this._overlaySidePanelService.show();
  }

  returnCheckAtivityDates(date: any) {
    let dates = moment(date, 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY');
    let currentdate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY');
    //
    if (moment(currentdate).isSameOrAfter(moment(dates))) {
      return true;
    } else {
      return false;
    }
  }

  returnDescriptionToShort(textContent: string) {
    const MAX_CHARS = 125;
    const fullText = textContent.trim(); // get full text and remove extra white space
    const excerptText =
      fullText.length > MAX_CHARS
        ? fullText.slice(0, MAX_CHARS) + '...'
        : fullText;
    return {
      textContent: excerptText,
      title:
        fullText.length > MAX_CHARS ? fullText.replace(/<(.|\n)*?>/g, '') : '',
    };
  }
  returnHousrAndMinShort(timerequired: any) {
    let time = timerequired.toString().trim().split('Hours')[0];
    let minute = timerequired
      .split('minutes')
      .filter(Boolean)
      .toString()
      .split('Hours')
      .pop();
    return `${time ? time : 0} Hrs ${minute ? minute : 0} mins`;
  }
  returnCoverImageAndCaption(images: any[]) {
    if (images?.length > 0) {
      
      let coverImage = images.find((item: any) => item.coverPhoto) || images[0];
      this.coverImage = coverImage;
      return true;
    } else {
      this.coverImage = '';
      return false;
    }
  }

  checkFileFormat(filename: string) {
    if (filename) {
      let imageTypes = new Set([
        'jpg',
        'jpeg',
        'jfif',
        'pjpeg',
        'pjp',
        'png',
        'svg',
      ]);
      let videoTypes = new Set(['mp4', 'ogg', 'webm', 'mov', 'avi']);
      const fileExtension: any = filename.split('.').pop();

      if (imageTypes.has(fileExtension)) {
        return FileTypes.IMAGE;
      } else if (videoTypes.has(fileExtension)) {
        return FileTypes.VIDEO;
      } else {
        return FileTypes.INVALID;
      }
    } else {
      return FileTypes.INVALID;
    }
  }

  returnActivityLinkUrl(data: any) {
    const url =
      environment.webUrl +
      this.location.prepareExternalUrl(
        this.router.serializeUrl(
          this.router.createUrlTree(['activity/activity-detail'], {
            queryParams: {
              activityUUID: btoa(data.activityUUID),
              activityId: btoa(data.activityId),
              p: 1, //for preview
            },
          })
        )
      );
    return url;
  }
  returnEncrypted(value: any) {
    return btoa(value);
  }
  formatLocation(locations: any) {
    // This function is used for giving space after comma; Then only the css will take.
    if (locations?.length > 0) {
      let splittedLocations = locations.split(',');
      if (splittedLocations.length > 0) {
        return splittedLocations.join(', ');
      } else {
        return locations;
      }
    } else {
      return locations;
    }
  }
}
