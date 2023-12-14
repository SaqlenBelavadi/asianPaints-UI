import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-evp',
  templateUrl: './about-evp.component.html',
  styleUrls: ['./about-evp.component.scss'],
})
export class AboutEvpComponent implements OnInit, OnDestroy {
  dashboardSearchCriteria: any;
  dashBoardCardsData: any;
  filterSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService
  ) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterService
      .getdrpdwnValues()
      .subscribe(async (filters: any) => {
        // update component based on the changes in filters object
        if (filters && this.apiService.currentRouteUrl == '/about-evp') {
          let filterSplitted = filters.split(':');
          let findIndexOfTimeRequired = filterSplitted.findIndex((item: any) =>
            item.includes('timerequired=')
          );
          filterSplitted.splice(findIndexOfTimeRequired, 1);
          this.dashboardSearchCriteria = filterSplitted.toString();
          this.getDashboardCards();
          this.apiService.viewBreadCrumb$.next({ status: false });
        }
      });
  }
  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
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
      complete: () => {},
    });
  }
}
