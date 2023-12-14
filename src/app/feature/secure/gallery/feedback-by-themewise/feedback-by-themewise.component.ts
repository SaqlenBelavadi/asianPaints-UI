import { HttpParams } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { GalleryAPI } from '@shared/constants/api-endpoints/gallery-api.const';
import { Roles } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';
import { FeedbackReadMoreComponent } from '../../activity/activity-details/feedback-read-more/feedback-read-more.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { ConfirmParticipationSuccessComponent } from '../../activity/confirm-participation-success/confirm-participation-success.component';
@Component({
  selector: 'app-feedback-by-themewise',
  templateUrl: './feedback-by-themewise.component.html',
  styleUrls: ['./feedback-by-themewise.component.scss'],
})
export class FeedbackByThemewiseComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() feedbackDetails: any;
  @Input() themeName: any;
  @Input() type: any;

  currentPage: number = 0;
  totalItems: number = 0;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any = {};
  feedbackSearchParam: any;
  pageLimit: number = 4;
  isSelectedAllFeedback = false;
  feedbackForm = this.fb.group({
    feedbacks: this.fb.array([]),
  });
  enableOrDisableBtn: boolean = false;
  feedbackItems: any;
  role: any;
  sideOverlayData: any;
  feedbackCloseSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private pagerService: PagerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private storageService: LocalService,
    private communicationService: CommunicationService,
    private _overlaySidePanelService: OverlaySidePanelService
  ) {}

  public get roleEnum() {
    return Roles;
  }

  ngOnInit(): void {
    this.role = this.storageService.getData('Role');

    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });
    this.getInitialData();
    this.feedbackFormArray.valueChanges.subscribe((values: any) => {
      const enableButton = values.some((value: any) => value === true);
      if (enableButton) {
        this.enableOrDisableBtn = true;
      } else {
        this.enableOrDisableBtn = false;
      }
    });

    this.feedbackCloseSubscription =
      this.apiService.feedbackPanelClose$.subscribe((res) => {
        console.log('gallery feedback');

        if (res) {
          if (res.status) {
            // if (res.type == 'Add') {
            //   this.toastr.success('Feedback created successfully');
            // } else if (res.type == 'Edit') {
            //   this.toastr.success('Feedback updated successfully');
            // }
            const dialogRef = this.dialog.open(
              ConfirmParticipationSuccessComponent
            );
            dialogRef.afterClosed().subscribe((status: any) => {
              if (status) {
                this.fetchFeedbackDetails(this.themeName);
              }
            });
          }
        }
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.feedbackDetails?.firstChange) {
      if (changes?.feedbackDetails) {
        this.feedbackDetails = null;
      }

      this.feedbackDetails = changes?.feedbackDetails?.currentValue;
      this.getInitialData();
    }
  }
  ngOnDestroy(): void {
    if (this.feedbackCloseSubscription) {
      this.feedbackCloseSubscription.unsubscribe();
    }
  }
  getInitialData() {
    if (
      this.feedbackDetails &&
      Object.keys(
        this.feedbackDetails[this.themeName][this.type].activityFeedback
      ).length > 0
    ) {
      this.currentPage = this.feedbackDetails[this.themeName][this.type].pageNo;
      this.totalItems =
        this.feedbackDetails[this.themeName][this.type].totalElements;
      this.pager = this.pagerService.getPager(
        this.totalItems,
        this.currentPage,
        this.pageLimit
      );

      // this.feedbackDetails[this.themeName][this.type].activityFeedback =
      //   this.feedbackDetails[this.themeName][this.type].activityFeedback
      //     .length > 0
      //     ? this.feedbackDetails[this.themeName][
      //         this.type
      //       ].activityFeedback.slice(
      //         this.pager.startIndex,
      //         this.pager.endIndex + 1
      //       )
      //     : [];

      this.pagedItems = this.feedbackDetails;
      this.feedbackFormArray.clear();
      this.addFeedbackToForm();
    }
  }
  get feedbackFormArray() {
    return this.feedbackForm.controls['feedbacks'] as FormArray;
  }

  onPageChange(event: any, themeName: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.fetchFeedbackDetails(themeName);
    }
  }
  fetchFeedbackDetails(themeName: string) {
    let filterToString = ``;
    // add : for all filters except first one
    let entryIndex = 0;
    for (let [key, value] of this.filterService.globalFilterArr.entries()) {
      if (entryIndex !== 0) filterToString += ':';
      if (key == 'themeName') {
        filterToString += `themeName=${themeName}`.toString().trim();
      } else {
        filterToString += `${value}`.toString().trim();
      }
      entryIndex++;
    }
    const params = new HttpParams()
      .set('searchCriteria', filterToString)
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageLimit);
    const fetchUrl = `${GalleryAPI.getAllFeedbacksUrl()}?${params}`;
    this.communicationService
      .get(fetchUrl, { responseType: 'text' }, true)
      .subscribe({
        next: (val: any) => {
          if (val) {
            //
            const value = JSON.parse(val);
            if (value) {
              this.setPage(this.currentPage, { ...value.data });
            }
          }
        },
        error: (err: any) => {
          this.toastr.error(err);
        },
        complete: () => {
          //
        },
      });
  }

  setPage(page: number, val: any) {
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      val[this.themeName][this.type].activityFeedback.totalElements,
      page,
      this.pageLimit
    );
    // val[this.themeName][this.type].activityFeedback =
    //   val[this.themeName][this.type].activityFeedback.length > 0
    //     ? val[this.themeName][this.type].activityFeedback.slice(
    //         this.pager.startIndex,
    //         this.pager.endIndex + 1
    //       )
    //     : [];
    //
    this.pagedItems = val;
    this.feedbackFormArray.clear();
    this.addFeedbackToForm();
  }
  selectAllfeedbacks() {
    this.isSelectedAllFeedback = !this.isSelectedAllFeedback;

    this.pagedItems[this.themeName][this.type].activityFeedback.map(
      (image: any, index: number) => {
        this.updateFeedbackFormArray(index, this.isSelectedAllFeedback);
      }
    );
  }

  updateFeedbackFormArray(index: number, status: boolean) {
    this.feedbackFormArray.at(index).patchValue(status);
  }

  addFeedbackToForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let image of this.pagedItems[this.themeName][this.type]
      .activityFeedback) {
      const checkboxFormControl = new FormControl(false);
      this.feedbackFormArray.push(checkboxFormControl);
    }
  }

  removeFeedbackForm(index: number) {
    this.feedbackFormArray.removeAt(index);
  }

  publishOrUnpublishFeedbacks(status: boolean, themeName: any) {
    const selectedFeedbacks: any = [];

    this.pagedItems[this.themeName][this.type].activityFeedback.map(
      (feedback: any, index: number) => {
        const isSelected = this.feedbackFormArray.value[index];
        if (isSelected) {
          selectedFeedbacks.push(feedback.feedbackId);
        }
      }
    );

    if (selectedFeedbacks?.length) {
      this.publishOrUnpublishFeedbacksToApi(
        selectedFeedbacks,
        status,
        themeName
      );
    }
  }

  publishOrUnpublishFeedbacksToApi(
    selectedImages: Array<any>,
    status: any,
    themeName: any
  ) {
    const feedbacksUrl = GalleryAPI.publishOrUnpublishFeedback();

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: `${status ? 'Publish' : 'Unpublish'} Feedbacks?`,
        message: `Are you sure you want to ${
          status ? 'Publish' : 'Unpublish'
        } the feedback?`,
      },
    });

    dialogRef.afterClosed().subscribe((statuss) => {
      if (statuss) {
        const params = new HttpParams()
          .set('Id', selectedImages.toString())
          .set('status', status ? 'Published' : 'UnPublished');
        this.apiService
          .post({}, `${feedbacksUrl}?${params.toString().trim()}`)
          .subscribe(() => {
            this.toastr.success(
              `${
                status
                  ? 'Successfully Published feedbacks'
                  : 'Successfully Unpublished feedbacks'
              }`
            );
            this.currentPage = 1;
            this.fetchFeedbackDetails(themeName);
          });
      }
    });
  }

  removeFeedbacks(themeName: any) {
    const selectedFeedbacks: any = [];
    this.pagedItems[this.themeName][this.type].activityFeedback.map(
      (feedback: any, index: number) => {
        const isSelected = this.feedbackFormArray.value[index];
        if (isSelected) {
          selectedFeedbacks.push(feedback.feedbackId);
        }
      }
    );
    if (selectedFeedbacks?.length) {
      this.removeFeedbacksToApi(selectedFeedbacks, themeName);
    }
  }

  removeSingleFeedback(feedbacks: any, themeName: any) {
    this.removeFeedbacksToApi(feedbacks, themeName);
  }

  removeFeedbacksToApi(selectedFeedbacks: Array<any>, themeName: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Delete Feedbacks?',
        message: `Are you sure you want to delete the feedbacks?`,
      },
    });

    dialogRef.afterClosed().subscribe((status) => {
      if (status) {
        const params = new HttpParams().set('Id', selectedFeedbacks.toString());
        const feedbackUrl = `${GalleryAPI.deleteFeedbacksFromGalleryUrl()}?${params.toString()}`;
        this.apiService.delete({}, `${feedbackUrl}`).subscribe((res: any) => {
          this.toastr.success(
            res.data
              ? res?.data
              : res?.message
              ? res.message
              : 'Activity feedback deleted from gallery successfully'
          );
          this.currentPage = 1;
          this.fetchFeedbackDetails(themeName);
        });
      }
    });
  }

  getShortName(fullName: string) {
    return fullName
      ? fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
      : '';
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
  openFeedbackDetails(data: any) {
    this.dialog.open(FeedbackReadMoreComponent, {
      width: '470px',
      data: data,
    });
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
    this.apiService.feedbackEditFromGallery$.next(true);
    // this._overlaySidePanelService.setContent(AddFeedbackComponent);
    // this._overlaySidePanelService.show();
  }
}
