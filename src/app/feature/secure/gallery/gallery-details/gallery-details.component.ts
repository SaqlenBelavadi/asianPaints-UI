import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { GalleryAPI } from '@shared/constants/api-endpoints/gallery-api.const';
import { Roles } from '@shared/enums/role.enum';
import { Subscription } from 'rxjs';
import { AddFeedbackComponent } from '../../activity/add-feedback/add-feedback.component';
@Component({
  selector: 'app-gallery-details',
  templateUrl: './gallery-details.component.html',
  styleUrls: ['./gallery-details.component.scss'],
})
export class GalleryDetailsComponent implements OnInit, OnDestroy {
  selectedTabIndex: number = 0;
  gallerySearchParam: any;
  role: any;

  publishedItems: any;
  unPublishedItems: any;
  creativesItems: any;

  type: any;

  feedbackItems: any;
  sideOverlayData: any;
  dropDownSubscription: Subscription;
  feedbackCloseSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private storageService: LocalService,
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

    this.dropDownSubscription = this.filterService
      .getdrpdwnValues()
      .subscribe(async (filters: any) => {
        // update component based on the changes in filters object
        if (
          filters &&
          this.apiService.currentRouteUrl == '/gallery/gallery-list'
        ) {
          this.gallerySearchParam = filters.toString().trim();
          this.fetchGalleryDetails();
          this.fetchFeedbackDetails();
        }
      });

    this.apiService.feedbackEditFromGallery$.subscribe((status) => {
      if (status) {
        this.sideOverlayData = {
          width: '750',
          label: 'Edit Feedback',
          isEdit: false,
          data: {},
        };

        this._overlaySidePanelService.setContent(AddFeedbackComponent);
        this._overlaySidePanelService.show();
      }
    });
    this.feedbackCloseSubscription =
      this.apiService.feedbackPanelClose$.subscribe((res) => {
        if (res.status) {
          this._overlaySidePanelService.close();
        }
      });
  }
  ngOnDestroy(): void {
    if (this.dropDownSubscription) {
      this.dropDownSubscription.unsubscribe();
    }
    if (this.feedbackCloseSubscription) {
      this.feedbackCloseSubscription.unsubscribe();
    }
  }
  onTabChanged(event: any) {
    let clickedIndex = event.index;
    this.selectedTabIndex = clickedIndex;
    this.fetchGalleryDetails();
    this.fetchFeedbackDetails();
  }

  fetchGalleryDetails() {
    const params = new HttpParams()
      .set('imageType', 'ALL')
      .set('searchCriteria', this.gallerySearchParam.toString().trim())
      .set('pageNo', 1)
      .set('pageSize', 4);
    const fetchUrl = `${GalleryAPI.getAllImagesUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val) {
          this.selectedGallerTab(val);
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
  selectedGallerTab(val: any) {
    if (this.role == this.roleEnum.EMPLOYEE) this.selectedTabIndex = 0;
    switch (this.selectedTabIndex) {
      case 0:
        this.publishedItems = val.data.publishedImages;
        this.type = 'publishedImages';
        break;

      case 1:
        this.unPublishedItems = val.data.unPublishedImages;
        this.type = 'unPublishedImages';
        break;
      case 2:
        this.creativesItems = val.data.creativeImages;
        this.type = 'creativeImages';
        break;
      default:
        this.selectedTabIndex = 0;
        this.publishedItems = val.data.publishedImages;
        this.type = 'publishedImages';
        break;
    }
    //
  }

  fetchFeedbackDetails() {
    const params = new HttpParams()
      .set('searchCriteria', this.gallerySearchParam.toString().trim())
      // .set(
      //   'searchCriteria',
      //   'startDate=12/12/2022:endDate=12/12/2022:tagName=Water Tag test:activityName=Test One:location=Vakola:themeName=Health & Hygiene:modeOfParticipation=Online'
      // )
      .set('pageNo', 1)
      .set('pageSize', 4);
    const fetchUrl = `${GalleryAPI.getAllFeedbacksUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val) {
          this.feedbackItems = val.data;
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
}
