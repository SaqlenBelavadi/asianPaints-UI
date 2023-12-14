import { HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss'],
})
export class AdminBoardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'No',
    'date',
    'activity_id',
    'activity_name',
    'location',
    'activity_tag',
    'total_hours',
    'total_participants',
    'rating',
  ];
  @Input() options: any;

  selectedTabIndex: number = 0;
  role: any;
  dashboardSearchCriteria: any;

  dashBoardThemeWiseData: any;
  dashBoardModeWiseData: any;
  dashBoardCardsData: any;
  dashBoardFinanceData: any;
  dashBoardDeptWiseData: any;
  dashBoardEmptWiseData: any;
  dashBoardLoctWiseData: any;
  dashBoardMonthWiseData: any;

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 5;
  currentPager: any = {};
  pastActitivtyDetails: any[] = [];
  dropDownSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private storageService: LocalService,
    private pagerService: PagerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });

    this.dropDownSubscription = this.filterService
      .getdrpdwnValues()
      .subscribe(async (filters: any) => {
        // update component based on the changes in filters object
        if (filters && this.apiService.currentRouteUrl == '/dashboard') {
          this.dashboardSearchCriteria = filters;
          this.currentPage = 1;
          this.getDashboardApi();
          this.getDashboardCards();
          this.getPastActivities('initial');
        }
      });
  }
  ngOnDestroy(): void {
    if (this.dropDownSubscription) {
      this.dropDownSubscription.unsubscribe();
    }
  }

  onTabChanged(event: any) {
    let clickedIndex = event.index;
    this.selectedTabIndex = clickedIndex;
  }
  getDashboardApi() {
    const params = new HttpParams().set(
      'searchCriteria',
      this.dashboardSearchCriteria.toString().trim()
    );
    const fetchUrl = `${AdminActivityAPI.dashboardDetailsUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val: any) => {
        if (val.data) {
          this.dashBoardThemeWiseData = val?.data?.dashBoardThemeWiseData;
          this.dashBoardModeWiseData = val?.data?.dashBoardModeWiseDataDTO;
          this.dashBoardFinanceData = val?.data?.financialDetails;
          this.dashBoardDeptWiseData =
            val?.data?.dashBoardDepartmentWiseDataDTO;
          this.dashBoardEmptWiseData = val?.data?.dashBoardEmployeeWiseDataDTO;
          //
          this.dashBoardLoctWiseData = val?.data?.dashBoardLocationWiseDataDTO;
          this.dashBoardMonthWiseData = val?.data?.dashBoardMonthWiseDataDTO;
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
  getDashboardCards() {
    const params = new HttpParams().set(
      'searchCriteria',
      this.dashboardSearchCriteria.toString().trim()
    );
    const fetchUrl = `${AdminActivityAPI.dashboardCardsUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val.data) {
          this.dashBoardCardsData = val?.data;
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

  getPastActivities(type: any) {
    const params = new HttpParams()
      .set('searchCriteria', this.dashboardSearchCriteria.toString().trim())
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);
    const fetchUrl = `${AdminActivityAPI.dashboardPastActivityUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val.data) {
          this.totalItems = val?.data?.totalElements;

          this.setPage(
            this.currentPage,
            val?.data?.dashBoardPastActivityDetailsDTOs,
            type
          );
        }
      },
      error: () => {
        this.totalItems = 0;
        this.setPage(1, [], type);
      },
      complete: () => {
        //
      },
    });
  }
  setPage(page: number, val: any, type: any) {
    //
    // get pager object from service

    if (type == 'initial') {
      this.currentPager = this.pagerService.getPager(
        val && val.length ? val.length : 0,
        page,
        this.pageSize
      );
    }
    this.pager = this.pagerService.getPager(
      this.totalItems,
      page,
      this.pageSize
    );
    this.currentPage = page;

    // get current page of items
    this.pagedItems = val;

    //
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.currentPager = event.pager;
      this.currentPage = this.currentPager.currentPage;
      this.getPastActivities('normal');
    }
  }
  goToParticipantsDetails() {
    this.router.navigate(['/participation/participation-list'], {
      queryParams: {
        dashboardDetails: btoa('true'),
      },
    });
  }
  goToActivityDetails(activity: any) {
    this.router.navigate(['/activity/activity-detail'], {
      queryParams: {
        activityId: btoa(activity.activityId),
        activityUUID: btoa(activity.activityUUID),
        location: btoa(activity.activityLocation),
        state: btoa('2'),
      },
    });
  }

  sortData(sort: Sort) {
    //
    const data = this.pagedItems.slice();

    if (!sort.active || sort.direction === '') {
      this.pagedItems = data;
      return;
    }

    this.pagedItems = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'rating':
          return compare(a.rating, b.rating, isAsc);
        case 'total_participants':
          return compare(a.totalParticipants, b.totalParticipants, isAsc);
        case 'total_hours':
          return compare(a.totalParticipants, b.totalParticipants, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
