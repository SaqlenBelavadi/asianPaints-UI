import { Location } from '@angular/common';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { ImageUploadComponent } from '../../secure-shared/components/image-upload/image-upload.component';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { FeedbackReadMoreComponent } from './feedback-read-more/feedback-read-more.component';
import { Subscription } from 'rxjs';
import { Roles } from '@shared/enums/role.enum';
import { ImageInDialogComponent } from '../../common/image-in-dialog/image-in-dialog.component';
import { ConfirmParticipationSuccessComponent } from '../confirm-participation-success/confirm-participation-success.component';
enum FileTypes {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  INVALID = 'INVALID',
}

enum ActivityState {
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
  CREATED = 'CREATED',
}

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss'],
})
export class ActivityDetailsComponent implements OnInit, OnDestroy {
  sliderArry: any = [];

  activityDetail: any;
  imagesList: any;
  isSelectedAll = false;
  activityForm = this.fb.group({
    images: this.fb.array([]),
  });
  activityId: string | null;
  activityUUID: string | null;
  fileTypes = FileTypes;
  role: string;
  sideOverlayData: { width: string; label: string; isEdit: boolean; data: {} };

  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: any;
  pageSize: number = 6;

  isPreview: boolean = false;
  enableOrDisableBtn: boolean = false;
  enableOrDisableFBtn: boolean = false;

  isSelectedAllFeedback = false;
  feedbackForm = this.fb.group({
    feedbacks: this.fb.array([]),
  });
  enableOrDisableFeedbackBtn: boolean = false;
  isHistory: boolean = false;
  activityLocation: any;

  fpager: any = {};

  // paged items
  fpagedItems: any[] = [];

  fcurrentPage: number = 1;
  ftotalItems: any = 0;
  fpageSize: number = 3;
  empDetails: any;
  activeImageIndex = 0;
  activityStateType = ActivityState;
  activityState = '';
  defaultLocation: any;
  feedbackCloseSubscription: Subscription;
  sideCloseSubscription: Subscription;
  testimonialBgImage: string = 'assets/images/activities/testimonial-bg.jpg';
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private storageService: LocalService,
    private toastr: ToastrService,
    private _overlaySidePanelService: OverlaySidePanelService,
    private communicationService: CommunicationService,
    private router: Router,
    private pagerService: PagerService,
    private location: Location,
    private _sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) {
    if (this.storageService.getData('d-loc')) {
      this.defaultLocation = this.storageService.getData('d-loc') as string;
    }
    this.sideOverlayData = {
      width: '950',
      label: 'Create Activity',
      isEdit: false,
      data: {},
    };
  }

  public get roleEnum(): typeof Roles {
    return Roles;
  }

  getActivityState(stateIndex: number) {
    switch (stateIndex) {
      case 0:
        return ActivityState.ONGOING;
      case 1:
        return ActivityState.UPCOMING;
      case 2:
        return ActivityState.PAST;
      case 3:
        return ActivityState.CREATED;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    this.role = this.storageService.getData('Role');
    this.empDetails = JSON.parse(this.storageService.getData('sub-info'));

    this.apiService.isProfileSwitched().subscribe((res: any) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      //
      this.activityId = params.activityId ? atob(params.activityId) : '';
      this.activityUUID = params.activityUUID ? atob(params.activityUUID) : '';
      this.isPreview = params.p && params.p == 1 ? true : false;
      this.isHistory = params.h
        ? (atob(params.h) as unknown as boolean)
        : false;
      this.activityLocation = params.location ? atob(params.location) : '';

      if (params.state) {
        let state = atob(params.state);
        this.activityState = this.getActivityState(+state);
      }
      //
      //
      //
      if (this.activityUUID || this.activityId) {
        this.getActivityDetail(this.activityUUID, this.activityId);
        this.getActivityFeedbachDetail();
        if (!this.isPreview) this.getImages();
      }
    });

    this.activityFormArray.valueChanges.subscribe((values: any) => {
      const enableButton = values.some((value: any) => value === true);
      if (enableButton) {
        this.enableOrDisableBtn = true;
      } else {
        this.enableOrDisableBtn = false;
      }
    });
    this.feedbackCloseSubscription =
      this.apiService.feedbackPanelClose$.subscribe((res: any) => {
        console.log('in details')
        if (res.status) {
          const dialogRef = this.dialog.open(
            ConfirmParticipationSuccessComponent
          );
          dialogRef.afterClosed().subscribe((status: any) => {
            if (status) {
              this.getActivityFeedbachDetail();
              this.getImages();
            }
          });
          //  window.scroll({
          //    top: 0,
          //    left: 0,
          //    behavior: 'smooth',
          //  });
          // // setTimeout(() => {
          // if (res.type == 'Add') {
          //   this.toastr.success('Feedback created successfully');
          // } else if (res.type == 'Edit') {
          //   this.toastr.success('Feedback updated successfully');
          // }
          // }, 3000);
        }
      });
    this.sideCloseSubscription = this.apiService.sidePanelClose$.subscribe(
      (res: any) => {
        //
        if (
          res &&
          this.apiService.currentRouteUrl.includes('/activity/activity-detail')
        ) {
          this.getActivityDetail(this.activityUUID, this.activityId);
          this.getActivityFeedbachDetail();
          if (!this.isPreview) this.getImages();
        }
      }
    );
    this.feedbackFormArray.valueChanges.subscribe((values: any[]) => {
      const enableButton = values.some((value: any) => value === true);
      if (enableButton) {
        this.enableOrDisableFBtn = true;
      } else {
        this.enableOrDisableFBtn = false;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.feedbackCloseSubscription) {
      this.feedbackCloseSubscription.unsubscribe();
    }
    if (this.sideCloseSubscription) {
      this.sideCloseSubscription.unsubscribe();
    }
  }

  getActivityDetail(activityUUID: string | null, activityId: string | null) {
    
    const activityUrl = ActivityAPI.getActivityUrl();
    let filter = '';
    if (activityUUID) {
      filter = `activityUUID=${activityUUID}`;
    } else {
      filter = `activityId=${activityId}`;
    }
    this.apiService
      .post(
        {},
        `${activityUrl}/Details?searchCriteria=${filter}:location=${this.activityLocation}`
      )
      .subscribe((res: any) => {
        //
        this.activityDetail = res?.data;
        // if (this.role == this.roleEnum.EMPLOYEE) {
        let data = {
          status: true,
          label: 'ActivityDetail',
          activityName: this.activityDetail?.activityName,
        };
        this.apiService.viewBreadCrumb$.next(data);
        // }
        this.setCoverPhotoActive();
      });
  }

  returnDate(date: any) {
    return moment(date, 'DD/MM/YYYY').format('Do MMM, YYYY');
  }

  getImages() {
    const params = new HttpParams()
      .set('searchCriteria', `activityId=${this.activityId}`)
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);
    const imagesUrl = `${ActivityAPI.imagesUrl()}/ActivityDetails`;
    this.apiService
      .get(`${imagesUrl}?${params.toString().trim()}`)
      .subscribe((res: any) => {
        this.imagesList = res?.data?.images;
        this.totalItems = res?.data?.totalElements;
        this.setPage(this.currentPage);
      });
  }

  selectAllImages() {
    this.isSelectedAll = !this.isSelectedAll;

    this.imagesList.map((image: any, index: number) => {
      this.updateImageFormArray(index, this.isSelectedAll);
    });
  }

  updateImageFormArray(index: number, status: boolean) {
    this.activityFormArray.at(index).patchValue(status);
  }

  addImagesToForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let image of this.imagesList) {
      const checkboxFormControl = new FormControl(false);

      this.activityFormArray.push(checkboxFormControl);
    }
  }

  removeImageForm(index: number) {
    this.activityFormArray.removeAt(index);
  }

  get activityFormArray() {
    return this.activityForm.controls['images'] as FormArray;
  }

  uploadImages() {
    const selectedImages: any = [];

    this.imagesList.map((image: any, index: number) => {
      const isSelected = this.activityFormArray.value[index];
      if (isSelected) {
        selectedImages.push({
          imageName: image.imageName,
          activityId: this.activityId,
        });
      }
    });

    //
    if (selectedImages?.length) {
      this.uploadImagesToApi(selectedImages);
    }
  }

  uploadSingleImage(image: any) {
    this.uploadImagesToApi([
      {
        imageName: image.imageName,
        activityId: this.activityId,
      },
    ]);
  }

  uploadImagesToApi(selectedImages: Array<any>) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Upload Images?',
        message: `Are you sure you want upload images to gallery?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const imagesUrl = ActivityAPI.imagesUrl();
        this.apiService
          .post(selectedImages, `${imagesUrl}/UploadToGallery`)
          .subscribe(() => {
            this.toastr.success('Successfully uploaded images to gallery');
            this.getImages();
          });
      }
    });
  }

  removeImages() {
    //
    const selectedImages: any = [];

    this.imagesList.map((image: any, index: number) => {
      const isSelected = this.activityFormArray.value[index];
      if (isSelected) {
        selectedImages.push({
          imageName: image.imageName,
          imageType: 'EMPLOYEE_UPLOAD',
          softDelete: false,
          activityId: this.activityId,
        });
      }
    });

    //
    if (selectedImages?.length) {
      this.removeImagesToApi(selectedImages);
    }
  }

  removeSingleImage(image: any) {
    this.removeImagesToApi([
      {
        imageName: image.imageName,
        imageType: 'EMPLOYEE_UPLOAD',
        softDelete: false,
        activityId: this.activityId,
      },
    ]);
  }

  removeImagesToApi(selectedImages: Array<any>) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Delete Images?',
        message: `Are you sure you want to delete the images?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const imagesUrl = ActivityAPI.imagesUrl();
        this.apiService.delete(selectedImages, `${imagesUrl}`).subscribe(() => {
          this.toastr.success('Successfully deleted Images');
          this.getImages();
        });
      }
    });
  }

  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

  checkFileFormat(filename: string) {
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
  }

  uploadImage() {
    //
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '670px',
      data: {
        activityName: this.activityDetail.activityId,
        activityTheme: this.activityDetail.themeName,
        activityTag: this.activityDetail.tagName,
        startDate: this.activityDetail.startDate,
        endDate: this.activityDetail.endDate,
        activityLocation: this.activityDetail.activityLocation,
        mode: this.activityDetail.modeOfParticipation,
        pagedItems: this.pagedItems,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) this.getImages();
    });
  }

  feedbackReadMore(data: any) {
    this.dialog.open(FeedbackReadMoreComponent, {
      width: '470px',
      data: data,
    });
  }
  enrollnow(activityDetail: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Enroll Activity?',
        message: `Are you sure you want to Enroll the activity ${activityDetail?.activityName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        let subInfo = JSON.parse(this.storageService.getData('sub-info'));
        const url = this.returnActivityLinkUrl({
          activityUUID: activityDetail?.activityUUID,
          activityId: activityDetail?.activityId,
        });
        const body = {
          employeeId: subInfo.employeecode,
          activityUuid: activityDetail?.activityUUID,
          enrolledOrParticipate: 'Enrolled',
          location: activityDetail?.activityLocation,
          activityUrl: url,
        };
        this.apiService
          .post(body, ActivityAPI.activityEnrollOrParticipateUrl())
          .subscribe({
            next: () => {
              this.toastr.success('Activity Enrolled Successfully');
              this.getActivityDetail(this.activityUUID, this.activityId);
              this.getImages();
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
    this.sideOverlayData = {
      width: '750',
      label: 'Add Feedback',
      isEdit: false,
      data: {},
    };

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

  deleteActivity(activityUUID: any, activityName: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
      data: {
        heading: 'Delete Activity?',
        message: `Are you sure you want to delete the activity ${activityName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const params = new HttpParams().set(
          'activityNameOrUUID=activityUUID',
          activityUUID
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
              this.router.navigate(['/activity/activities']);
            },
            error: (err: { error: { message: string | undefined } }) => {
              this.toastr.error(err.error.message);
            },
            complete: () => {},
          });
      }
    });
  }

  editActivity(data: any, type: any) {
    if (type == 'past') {
      this.apiService.isPastActivityEdit = true;
      this.apiService.activityEditFromList$.next(true);
    }
    const params = new HttpParams().set(
      'searchCriteria',
      `activityUUID=${data.activityUUID}`.toString().trim()
    );
    
    const fetchUrl = `${ActivityAPI.getActivityUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val: { data: { activity: any } }) => {
        if (val.data) {
          this.sideOverlayData.label = 'Edit Activity';
          this.sideOverlayData.isEdit = true;
          this.apiService.isActivityEdit = true;
          this.apiService.ativityEditData = val.data.activity;
          this._overlaySidePanelService.setContent(AddActivityComponent);
          this._overlaySidePanelService.show();
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

  publishActivity(activityDetails: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Publish Activity?',
        message: `Are you sure you want to publish the activity ${activityDetails.activityName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const url = this.returnActivityLinkUrl(activityDetails);
        const bodyObj = this.returnBodyObj();
        Object.assign(bodyObj, { activityUrl: url });
        this.apiService.post(bodyObj, ActivityAPI.ActivityUrl()).subscribe({
          next: () => {
            this.toastr.success('Activity Published Successfully');
            this.getActivityDetail(
              activityDetails.activityUUID,
              activityDetails.activityId
            );
          },
          error: (err: { error: { message: string | undefined } }) => {
            this.toastr.error(err.error.message);
          },
          complete: () => {},
        });
      }
    });
  }
  returnBodyObj() {
    let time = this.activityDetail.timeRequired
      .toString()
      .trim()
      .split('Hours');
    let minute = this.activityDetail.timeRequired
      .split('minutes')
      .filter(Boolean)
      .toString()
      .split('Hours')
      .pop();

    this.activityDetail.timeRequired = `${time[0].trim()} Hours ${minute.trim()} minutes`;
    return {
      activityUUID: this.activityDetail.activityUUID,
      activityName: this.activityDetail.activityName,
      activityId: this.activityDetail.activityId,
      themeName: this.activityDetail.themeName,
      tagName: this.activityDetail.tagName,
      activityLocation: this.activityDetail.activityLocation,
      modeOfParticipation: this.activityDetail.modeOfParticipation,
      startDate: this.activityDetail.startDate,
      endDate: this.activityDetail.endDate,
      timeOfActivity: this.activityDetail.timeOfActivity,
      timeRequired: this.activityDetail.timeRequired,
      completeDescription: this.activityDetail.completeDescription,
      briefDescription: this.activityDetail.briefDescription,
      dosInstruction: this.activityDetail.dosInstruction,
      dontInstruction: this.activityDetail.dontInstruction,
      contactPerson: this.activityDetail.contactPerson,
      contanctEmail: this.activityDetail.contanctEmail,
      needRequestFromCCSR: this.activityDetail.needRequestFromCCSR
        ? this.activityDetail.needRequestFromCCSR
        : false,
      requestFromCCSR: this.activityDetail.requestFromCCSR,
      csrAdminLocation: this.activityDetail.csrAdminLocation,
      badgeToBeProvided: this.activityDetail.badgeToBeProvided,
      activityPlace: this.activityDetail.activityPlace,
      objectiveActivity: this.activityDetail.objectiveActivity,
      created: false,
      published: true,
      testimonial: this.activityDetail.testimonial,
      testimonialPersonName: this.activityDetail.testimonialPersonName,
      rating: this.activityDetail.rating,
      pastVideoCaption: this.activityDetail.pastVideoCaption,
      pastVideoUrl: this.activityDetail.pastVideoUrl,
      activityFinancialDTO: {
        materialOrCreativeExpense: this.activityDetail.activityFinancialDTO
          .materialOrCreativeExpense
          ? this.activityDetail.activityFinancialDTO.materialOrCreativeExpense
          : '',
        logisticExpense: this.activityDetail.activityFinancialDTO
          .logisticExpense
          ? this.activityDetail.activityFinancialDTO.logisticExpense
          : '',
        gratificationExpense: this.activityDetail.activityFinancialDTO
          .gratificationExpense
          ? this.activityDetail.activityFinancialDTO.gratificationExpense
          : '',
        otherExpense: this.activityDetail.activityFinancialDTO.otherExpense
          ? this.activityDetail.activityFinancialDTO.otherExpense
          : '',
        actualMaterialExpense: this.activityDetail.activityFinancialDTO
          .actualMaterialExpense
          ? this.activityDetail.activityFinancialDTO.actualMaterialExpense
          : '',
        actualLogisticExpense: this.activityDetail.activityFinancialDTO
          .actualLogisticExpense
          ? this.activityDetail.activityFinancialDTO.actualLogisticExpense
          : '',
        actualGratificationExpense: this.activityDetail.activityFinancialDTO
          .actualGratificationExpense
          ? this.activityDetail.activityFinancialDTO.actualGratificationExpense
          : '',
        actualOtherExpense: this.activityDetail.activityFinancialDTO
          .actualOtherExpense
          ? this.activityDetail.activityFinancialDTO.actualOtherExpense
          : '',
      },
      images: this.activityDetail.images,
    };
  }

  setPage(page: number) {
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.imagesList && this.imagesList.length ? this.imagesList.length : 0,
      page,
      this.pageSize
    );
    this.currentPage = page;

    // get current page of items
    this.pagedItems = this.imagesList;

    this.activityFormArray.clear();
    this.addImagesToForm();
    //
  }
  setfPage(page: number, data: any) {
    //
    // get pager object from service
    this.fpager = this.pagerService.getPager(
      data && data.length ? data.length : 0,
      page,
      this.pageSize
    );
    this.fcurrentPage = page;

    // get current page of items
    this.fpagedItems = data;
    this.feedbackFormArray.clear();
    this.addFeedbackToForm();
    //
    //   ' this.fpagedItems  this.fpagedItems ',
    //   this.fpagedItems.length
    // );

    //
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.getImages();
    }
  }
  onfeedbackPageChange(event: any) {
    if (event.pager) {
      this.fpager = event.pager;
      this.fcurrentPage = this.fpager.currentPage;
      this.getActivityFeedbachDetail();
    }
  }
  getActivityFeedbachDetail() {
    let searchCriteria = '';
    if (this.role == this.roleEnum.EMPLOYEE) {
      searchCriteria = `activityId=${this.activityId}:employeeId=${this.empDetails.employeecode}`;
    } else {
      searchCriteria = `activityId=${this.activityId}`;
    }
    if (this.defaultLocation && this.role !== Roles.CADMIN) {
      searchCriteria = `${searchCriteria}:location=${this.defaultLocation}`;
    }
    const params = new HttpParams()
      .set('searchCriteria', searchCriteria.toString().trim())
      .set('pageNo', this.fcurrentPage)
      .set('pageSize', this.fpageSize);
    const activityUrl = ActivityAPI.activityDetailsFeedbackUrl();
    // const params = `activityName=${this.activityId}`;
    // const params = `activityName=Test One&activityUUID=38daeeae-d280-4b3c-9954-6fb8a7b17204`;
    this.apiService.get(`${activityUrl}?${params}`).subscribe(
      (res: any) => {
        //
        // this.sliderArry = res?.data?.activityFeedback;
        this.ftotalItems = res?.data?.totalElements;
        this.setfPage(this.fcurrentPage, res?.data?.activityFeedback);
      },
      () => {
        this.toastr.error('Something went wrong!!');
      }
    );
  }
  returnHousrAndMinShort(timerequired: any) {
    let time = timerequired
      ? timerequired.toString().trim().split('Hours')[0]
      : 0;
    let minute = timerequired
      ? timerequired
          .split('minutes')
          .filter(Boolean)
          .toString()
          .split('Hours')
          .pop()
      : 0;
    return `${time ? time : 0} Hrs ${minute ? minute : 0} mins`;
  }
  openFeedbackPanel() {
    this.sideOverlayData = {
      width: '750',
      label: 'Add Feedback',
      isEdit: false,
      data: {},
    };
    const details = {
      activityName: this.activityDetail.activityName,
      activityId: this.activityDetail.activityId,
      location: this.activityDetail.activityLocation,
      themeName: this.activityDetail.themeName,
      tagName: this.activityDetail.tagName,
      startDate: this.activityDetail.startDate,
      endDate: this.activityDetail.endDate,
      mode: this.activityDetail.modeOfParticipation,
      timeRequired: this.activityDetail.timeRequired,
    };
    this.sideOverlayData.isEdit = false;
    this.apiService.feedbackAddData = details;
    this._overlaySidePanelService.setContent(AddFeedbackComponent);
    this._overlaySidePanelService.show();
  }

  editFeedbackPanel(feedback: any) {
    this.sideOverlayData = {
      width: '750',
      label: 'Edit Feedback',
      isEdit: false,
      data: {},
    };

    this.sideOverlayData.isEdit = false;
    this.apiService.isfeedbackEdit = true;
    this.apiService.feedbackAddData = feedback;
    this._overlaySidePanelService.setContent(AddFeedbackComponent);
    this._overlaySidePanelService.show();
  }

  returnFeedbackToShort(textContent: string) {
    const MAX_CHARS = 95;
    const fullText = textContent.trim(); // get full text and remove extra white space
    const excerptText =
      fullText.length > MAX_CHARS
        ? fullText.slice(0, MAX_CHARS) + '...'
        : fullText;
    return {
      textContent: excerptText,
      show: fullText.length > MAX_CHARS ? true : false,
    };
  }

  /**
   * FEEDBACK ACTION SETION START
   */
  get feedbackFormArray() {
    return this.feedbackForm.controls['feedbacks'] as FormArray;
  }
  selectAllfeedbacks() {
    this.isSelectedAllFeedback = !this.isSelectedAllFeedback;

    this.fpagedItems.map((image: any, index: number) => {
      this.updateFeedbackFormArray(index, this.isSelectedAllFeedback);
    });
    // this.pagedItems[this.themeName][this.type].activityFeedback.map(
    //   (image: any, index: number) => {
    //     this.updateFeedbackFormArray(index, this.isSelectedAllFeedback);
    //   }
    // );
  }

  updateFeedbackFormArray(index: number, status: boolean) {
    this.feedbackFormArray.at(index).patchValue(status);
  }

  addFeedbackToForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let image of this.fpagedItems) {
      const checkboxFormControl = new FormControl(false);
      this.feedbackFormArray.push(checkboxFormControl);
    }
    // for (let image of this.pagedItems[this.themeName][this.type]
    //   .activityFeedback) {
    //   const checkboxFormControl = new FormControl(false);
    //   this.feedbackFormArray.push(checkboxFormControl);
    // }
  }

  removeFeedbackForm(index: number) {
    this.feedbackFormArray.removeAt(index);
  }

  uploadFeedbacksToGallery() {
    const selectedFeedbacks: any = [];

    this.fpagedItems.map((feedback: any, index: number) => {
      const isSelected = this.feedbackFormArray.value[index];
      if (isSelected) {
        selectedFeedbacks.push(feedback.feedbackId);
      }
    });
    // this.pagedItems[this.themeName][this.type].activityFeedback.map(
    //   (feedback: any, index: number) => {
    //     const isSelected = this.feedbackFormArray.value[index];
    //     if (isSelected) {
    //       selectedFeedbacks.push(feedback.feedbackId);
    //     }
    //   }
    // );

    if (selectedFeedbacks?.length) {
      this.publishOrUnpublishFeedbacksToApi(selectedFeedbacks);
    }
  }

  publishOrUnpublishFeedbacksToApi(selectedImages: Array<any>) {
    const feedbacksUrl = ActivityAPI.uploadFeedbackToGalleryUrl();

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: `Upload Feedbacks?`,
        message: `Are you sure you want to upload the feedback to gallery?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const params = new HttpParams().set('Id', selectedImages.toString());
        this.apiService
          .post({}, `${feedbacksUrl}?${params.toString().trim()}`)
          .subscribe(() => {
            this.toastr.success('Successfully uploaded feedbacks');
            this.getActivityFeedbachDetail();
          });
      }
    });
  }

  removeFeedbacks() {
    const selectedFeedbackIds: any = [];
    this.fpagedItems.map((feedback: any, index: number) => {
      const isSelected = this.feedbackFormArray.value[index];
      if (isSelected) {
        selectedFeedbackIds.push(feedback.feedbackId);
      }
    });
    // this.pagedItems[this.themeName][this.type].activityFeedback.map(
    //   (feedback: any, index: number) => {
    //     const isSelected = this.feedbackFormArray.value[index];
    //     if (isSelected) {
    //       selectedEmpIds.push(feedback.feedbackId);
    //     }
    //   }
    // );
    // if (selectedEmpIds?.length) {
    //   let removeObj = {
    //     employeeIds: selectedEmpIds,
    //     activityName: this.activityDetail.activityId,
    //   };
    this.removeFeedbacksToApi(selectedFeedbackIds);
    // }
  }
  removeSingleFeedback(feedbackId: any) {
    this.removeFeedbacksToApi([feedbackId]);
  }
  removeFeedbacksToApi(selectedFeedbacks: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Delete Feedbacks?',
        message: `Are you sure you want to delete the feedbacks?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const feedbackUrl = `${ActivityAPI.activityDetailsFeedbackUrl()}?id=${selectedFeedbacks.toString()}`;
        this.apiService.delete({}, feedbackUrl).subscribe(
          (res: any) => {
            this.toastr.success(res.data);
            this.getActivityFeedbachDetail();
          },
          (err) => {
            this.toastr.error(err.error.message);
          }
        );
      }
    });
  }
  goToGallery() {
    this.router.navigate(['/gallery/gallery-list']);
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

  setCoverPhotoActive() {
    for (const [index, image] of this.activityDetail.images?.entries()) {
      if (image.coverPhoto) {
        this.activeImageIndex = index;
        break;
      }
    }
  }
  sanitizeHtml(v: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(v);
  }
  returnEncrypted(value: any) {
    return btoa(value);
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
  downloadImg(url: any) {
    const imgName = url.substr(url.lastIndexOf('/') + 1);
    this.httpClient
      .get(url, { responseType: 'blob' as 'json' })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });
        // IE
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          (window.navigator as any).msSaveOrOpenBlob(file);
          return;
        }
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;
        link.dispatchEvent(
          new MouseEvent('click', {
            cancelable: true,
            view: window,
          })
        );
      });
  }
  preview(url: any) {
    this.dialog.open(ImageInDialogComponent, {
      // width: '844px',
      panelClass: 'dialog-container',
      disableClose: true,
      data: {
        url,
      },
    });
  }
}
