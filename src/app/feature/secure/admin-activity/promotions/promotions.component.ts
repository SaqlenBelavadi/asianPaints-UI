import { Component, OnInit } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { ToastrService } from 'ngx-toastr';
import { AddPromotionsComponent } from './add-promotions/add-promotions.component';
import { HttpParams } from '@angular/common/http';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';
import * as moment from 'moment';
import { Roles } from '@shared/enums/role.enum';
import { Subscription } from 'rxjs';
import { PagerService } from '@core/services/pager.service';
@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  role: any;
  pagedItems: any[] = [];
  sideOverlayData: any;
  promotionData: any;
  subScription: Subscription;
  globalSearchCriteria: any;

  // pager object
  pager: any = {};

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 3;
  constructor(
    private _overlaySidePanelService: OverlaySidePanelService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private filterService: AppFilterService,
    private storageService: LocalService,
    private pagerService: PagerService
  ) {
    this.sideOverlayData = {
      width: '750',
      label: 'Add new promotion',
    };
  }

  public get roleEnum() {
    return Roles;
  }

  ngOnInit(): void {
    this.role = this.storageService.getData('Role');
    this.subScription = this.filterService
      .getdrpdwnValues()
      .subscribe(async (filters: any) => {
        // update component based on the changes in filters object
        if (
          filters &&
          (this.apiService.currentRouteUrl == '/admin-activity/promotions' ||
            this.apiService.currentRouteUrl.includes('/promotions'))
        ) {
          this.globalSearchCriteria = filters;
          this.currentPage = 1;
          this.getPromotionDetails();
        }
      });
    this.apiService.promotionSidePanelClose$.subscribe((status) => {
      if (status) {
        // this._overlaySidePanelService.close();
        this.getPromotionDetails();
      }
    });
  }
  // async callPromotionsApi() {
  //   if (this.role == Roles.ADMIN) {
  //     const defaultLoc = this.storageService.getData('d-loc') as string;
  //     let filter = `searchCriteria=location=${defaultLoc}`;
  //     this.getPromotionDetails(filter);
  //   } else if (this.role == Roles.CADMIN) {
  //     await this.fetchLov('Locations').then((locations: any) => {
  //       let locNames = locations.map((item: any) => item.lovValue);
  //       let filter = `searchCriteria=location=${locNames.toString()}`;
  //       this.getPromotionDetails(filter);
  //     });
  //   }
  // }
  addPromotion() {
    this.sideOverlayData = {
      width: '750',
      label: 'Add new promotion',
    };
    this._overlaySidePanelService.setContent(AddPromotionsComponent);
    this._overlaySidePanelService.show();
    // }
  }
  async getPromotionDetails() {
    const params = new HttpParams()
      .set('searchCriteria', this.globalSearchCriteria)
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);

    const fetchUrl = `${ActivityAPI.addPromotionUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe((res) => {
      if (res) {
        //
        this.promotionData =
          res.data?.activityPromotion?.length > 0
            ? res.data.activityPromotion
            : [];
        this.totalItems = res?.data?.totalElements ?? 0;
        this.setPage(this.currentPage);
      }
      // this.getPromotionImage();
    });
  }
  setPage(page: number) {
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.totalItems,
      page,
      this.pageSize
    );
    this.currentPage = page;

    // get current page of items
    this.pagedItems = this.promotionData;

    //
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.getPromotionDetails();
    }
  }
  async fetchLov(category: string) {
    const params = new HttpParams().set('category', category);
    const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
    return new Promise((resolve, reject) => {
      this.apiService.get(fetchUrl).subscribe({
        next: (val: { lovResponses: any }) => {
          resolve(val.lovResponses ?? []);
        },
        error: (err: { message: string | undefined }) => {
          this.toastr.error(err.message);
          reject('Something went wrong');
        },
        complete: () => {
          //
        },
      });
    }).then((res) => {
      return res;
    });
  }

  getPromotionImage() {
    const imagesUrl = `${ActivityAPI.imagesUrl()}?imageType=PROMOTIONS&searchCriteria=activityId=${
      this.promotionData.activityId
    }`;
    this.apiService.get(imagesUrl).subscribe((res) => {
      if (res) {
        this.promotionData.images = res.data;
      }
    });
  }
  editPromotion(promotionId: any) {
    const params = new HttpParams().set(
      'promotionId',
      `${promotionId}`.toString().trim()
    );
    const fetchUrl = `${ActivityAPI.activityPromotionListing()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val?.data) {
          this.sideOverlayData.label = 'Edit Promotion';
          this.sideOverlayData.isEdit = true;
          this.apiService.isPromotionEdit = true;
          this.apiService.promotionEditData = val?.data;
          this._overlaySidePanelService.setContent(AddPromotionsComponent);
          this._overlaySidePanelService.show();
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
      complete: () => {},
    });
  }
  deletePromotion(id: any, type: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',

      // width: '844px', promotion
      // panelClass: 'dialog-container',

      data: {
        heading: 'Delete Promotion?',
        message: `Are you sure you want to delete the promotion?`,
      },
    });

    dialogRef.afterClosed().subscribe((res:any) => {
      if (res) {
        const fetchUrl = `${ActivityAPI.addPromotionUrl()}?Id=${id}`;
        this.apiService.delete({}, fetchUrl).subscribe((res) => {
          if (res) {
            this.toastr.success('Promotion Deleted');
            this.getPromotionDetails();
            if (type == 'add') {
              this._overlaySidePanelService.setContent(AddPromotionsComponent);
              this._overlaySidePanelService.show();
            }
          }
        });
      }
    });
  }
  returnDateFormated(date: any) {
    return moment(date, 'DD/MM/YYYY hh:mm:ss A').format('Do MMM, YYYY');
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
