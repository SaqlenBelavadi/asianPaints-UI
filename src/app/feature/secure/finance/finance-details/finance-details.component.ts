import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { CommunicationService } from '@core/services/communication.service';
import { PagerService } from '@core/services/pager.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.scss'],
})
export class FinanceDetailsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'No',
    'Activity ID',
    'Name',
    'Activity Date',
    'Location',
    'Estimated',
    'Actual',
    'Logistic',
    'ActualLogistics',
    'Gratification',
    'Gratifi',
    'Others',
    'AOthers',
    'Total',
    'ATotal',
  ];

  financeSearchParams: any;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 5;
  searchControl: FormControl = new FormControl('');
  globalSearchParams: any;
  dropDownSubscription: Subscription;
  activityType: any;
  currentPager: any = {};

  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private pagerService: PagerService,
    private toastr: ToastrService,
    private communicationService: CommunicationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dropDownSubscription = this.filterService
      .getdrpdwnValues()
      .subscribe((filters: any) => {
        // update component based on the changes in filters object
        if (
          filters &&
          (this.apiService.currentRouteUrl == '/finance/finance-list' ||
            this.apiService.currentRouteUrl.includes('/finance/finance-list'))
        ) {
          this.globalSearchParams = filters;
          this.currentPage = 1;
          this.route.queryParams.subscribe((params: any) => {
            const activityType = params?.activityType
              ? atob(params?.activityType)
              : '';
            if (activityType) {
              this.activityType = activityType;
              this.getFinanceDetails('initial');
            } else {
              this.getFinanceDetails('initial');
            }
          });
        }
      });
  }
  ngOnDestroy(): void {
    if (this.dropDownSubscription) {
      this.dropDownSubscription.unsubscribe();
    }
  }

  getFinanceDetails(type: any) {
    if (this.searchControl.value) {
      this.financeSearchParams = `${this.globalSearchParams}:fieldValueToSearch=${this.searchControl.value}`;
      this.currentPage = 1;
    } else {
      this.financeSearchParams = this.globalSearchParams;
    }
    let params = new HttpParams()
      .set('searchCriteria', this.financeSearchParams.toString().trim())
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);
    if (this.activityType) {
      const keyToAppend = 'activityType';
      params = params.append(keyToAppend, this.activityType);
    }
    const fetchUrl = `${ActivityAPI.activityFinancialUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val?.data) {
          //
          this.totalItems = val?.data?.totalElements;
          this.setPage(this.currentPage, val?.data?.activityFinancials, type);
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
    if (type == 'initial') {
      this.currentPager = this.pagerService.getPager(
        this.totalItems,
        page,
        this.pageSize
      );
    }
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      val && val.length ? val.length : 0,
      page,
      this.pageSize
    );
    this.currentPage = page;

    // get current page of items
    this.pagedItems = val;
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.currentPager = event.pager;
      this.currentPage = this.currentPager.currentPage;
      this.getFinanceDetails('normal');
    }
  }

  searchParticipation() {
    if (this.searchControl.value) {
      this.getFinanceDetails('initial');
      this.currentPage = 1;
    }
  }
  closeSearch() {
    this.searchControl.setValue('');
    this.getFinanceDetails('initial');
  }
  onChangeState() {
    if (!this.searchControl.value) {
      this.getFinanceDetails('initial');
    }
  }
  downloadFinanceCsv() {
    const params = new HttpParams()
      .set('searchCriteria', this.financeSearchParams.toString().trim())
      .set('category', 'Finance');
    const fetchUrl = `${AdminActivityAPI.downloadCsvUrl()}?${params}`;
    this.communicationService
      .post(fetchUrl, '', { responseType: 'text' })
      .subscribe({
        next: (res: any) => {
          if (res) {
            const blob = new Blob([res as Blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${Date.now()}-finance.csv`; // set the file name as needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
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
}
