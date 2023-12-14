import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
} from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { ToastrService } from 'ngx-toastr';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { CommunicationService } from '@core/services/communication.service';
import { FormControl } from '@angular/forms';
import { ImportBulkComponent } from '../../knowledge-base/import-bulk/import-bulk.component';
import { Subscription } from 'rxjs';
import { Roles } from '@shared/enums';

export interface PeriodicElement {
  number: number;
  id: number;
  name: string;
  activityname: string;
  hours: number;
  location: string;
  approve: string;
  reject: string;
}

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.scss'],
})
export class ParticipationListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'No',
    'Employee ID',
    'Name',
    'Activity Id',
    'Activity Name',
    'Activity Tag',
    'Participation Hours',
    'Location',
    'Approve',
    'Reject',
  ];
  searchParam: any;
  globalSearchParam: any;
  role: any;
  search: any;

  participationSearchParams: any;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 5;
  activityId: any;
  activityType: any;
  currentPager: any = {};

  searchControl: FormControl = new FormControl('');
  isSearch: boolean = false;
  subScription: Subscription;
  isDashboardDetails: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private filterService: AppFilterService,
    private router: Router,
    private storageService: LocalService,
    private dialog: MatDialog,
    private pagerService: PagerService,
    private toastr: ToastrService,
    private communicationService: CommunicationService
  ) {
    this.role = this.storageService.getData('Role');
    if (this.role == this.roleEnum.EMPLOYEE) {
      this.displayedColumns.splice(-2);
    }
  }


  public get roleEnum(){
    return Roles;
  }

  ngOnInit(): void {
    this.subScription = this.filterService
      .getdrpdwnValues()
      .subscribe((filters: any) => {
        // update component based on the changes in filters object
        if (
          filters &&
          (this.apiService.currentRouteUrl ==
            '/participation/participation-list' ||
            this.apiService.currentRouteUrl.includes(
              'participation/participation-list'
            ))
        ) {
          this.globalSearchParam = filters;
          this.currentPage = 1;
          this.route.paramMap.subscribe((params: ParamMap) => {
            const id = params?.get('activityId')
              ? atob(params?.get('activityId') as string)
              : '';
            const type = params?.get('activityType')
              ? atob(params?.get('activityType') as string)
              : '';
            if (id && type) {
              this.activityId = id;
              this.activityType = type;
              this.getParicitpationList(id, 'initial');
            }
          });
          this.route.queryParams.subscribe((params: any) => {
            const fromDashboard = params?.dashboardDetails
              ? (atob(params?.dashboardDetails as string) as unknown as boolean)
              : false;
            if (fromDashboard) {
              this.isDashboardDetails = true;
              this.getParicitpationList('', 'initial');
            }
          });
          if (
            !this.activityId &&
            !this.activityType &&
            !this.isDashboardDetails
          ) {
            this.globalSearchParam = filters;
            this.getParicitpationList('', 'initial');
          }
        }
      });
  }
  ngOnDestroy(): void {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
  }

  getParicitpationList(id: string, type: any) {
    //
    if (id) {
      this.searchParam = `activityUUID=${id.toString().trim()}`;
    } else if (this.isSearch) {
      this.searchParam = `fieldValueToSearch=${this.searchControl.value.trim()}:${
        this.globalSearchParam
      }`;
    } else {
      this.searchParam = this.globalSearchParam;
    }
    let params = new HttpParams()
      .set('searchCriteria', this.searchParam.toString().trim())
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageSize);
    if (this.isDashboardDetails) {
      const keyToAppend = 'dashBoardDetails';
      params = params.append(keyToAppend, true);
    }
    if (this.activityType) {
      const keyToAppend = 'activityType';
      params = params.append(keyToAppend, this.activityType);
    }
    const fetchUrl = `${ActivityAPI.getParticipantsUrl()}?${params
      .toString()
      .trim()}`;
    this.apiService.get(fetchUrl).subscribe({
      next: (val: any) => {
        this.totalItems = val.data.totalElements;
        //
        if (
          val.data.employeeActivityHistories &&
          val.data.employeeActivityHistories.length
        ) {
          this.setPage(
            this.currentPage,
            val.data.employeeActivityHistories,
            type
          );
          if (this.activityId) {
            let data = {
              status: true,
              label: 'Participation',
              activityName: val.data.employeeActivityHistories[0].activityName,
            };
            this.apiService.viewBreadCrumb$.next(data);
          }
        }
      },
      error: () => {
        this.totalItems = 0;
        this.setPage(1, [], 'normal');
        // this.toastr.error(err) ;
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
        this.totalItems,
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
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.currentPager = event.pager;

      this.currentPage = this.currentPager.currentPage;
      if (this.activityId) {
        this.getParicitpationList(this.activityId, 'normal');
      } else {
        this.getParicitpationList('', 'normal');
      }
    }
  }

  selectAll(type: string, event: any) {
    if (type === 'APPROVE') {
      this.pagedItems.map((item) => {
        item['approvedByAdmin'] = event.checked;
        item['rejectedByAdmin'] = false;
      });
    } else if (type === 'REJECT') {
      this.pagedItems.map((item) => {
        item['rejectedByAdmin'] = event.checked;
        item['approvedByAdmin'] = false;
      });
    }
  }

  saveAll() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Save Participation',
        message: `Are you sure you want to Save ?`,
      },
    });
    dialogRef.afterClosed().subscribe((status:any) => {
      if (status) {
        this.saveApplicantsApi();
      }
    });
  }

  saveApplicantsApi() {
    const participationBody: any = [];
    this.pagedItems.forEach((item) => {
      participationBody.push({
        employeeId: item.employeeId,
        activityUUID: item.activityUUID,
        employeeName: item.employeeName,
        activityTag: item.activityTag,
        activityLocation: item.activityLocation,
        participationHours: item.participationHours,
        approvedByAdmin: item.approvedByAdmin,
        rejectedByAdmin: item.rejectedByAdmin,
        employeeActivityStatus: item.employeeActivityStatus,
      });
    });

    const fetchUrl = `${ActivityAPI.activityApprovrOrRejectUrl()}`;
    this.apiService.post(participationBody, fetchUrl).subscribe(
      (res) => {
        if (res) {
          this.toastr.success('Participation Saved');
          this.getParicitpationList(this.activityId, 'normal');
        }
      },
      () => {
        this.toastr.error('Something went wrong!');
        this.getParicitpationList(this.activityId, 'normal');
      }
    );
  }

  approve(event: any, element: any) {
    if (event.checked == true) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '470px',
        data: {
          heading: 'Aprrove Participation?',
          message: `Are you sure you want to Approve ?`,
        },
      });
      dialogRef.afterClosed().subscribe((status:any) => {
        if (status) {
          this.approveOrRejectToApi(event.checked, 'approve', element);
        } else {
          this.getParicitpationList(this.activityId, 'normal');
        }
      });
    }
  }
  reject(event: any, element: any) {
    if (event.checked == true) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: {
          heading: 'Reject Participation?',
          message: `Are you sure you want to Reject ?`,
        },
      });
      dialogRef.afterClosed().subscribe((status:any) => {
        if (status) {
          this.approveOrRejectToApi(event.checked, 'reject', element);
        } else {
          this.getParicitpationList(this.activityId, 'normal');
        }
      });
    }
  }

  downloadParticipationCsv() {
    let params = new HttpParams()
      .set('searchCriteria', this.searchParam.toString().trim())
      .set('category', 'Participants');
    if (this.isDashboardDetails) {
      const keyToAppend = 'dashBoardDetails';
      params = params.append(keyToAppend, true);
    }
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
            link.download = `${Date.now()}-participants.csv`; // set the file name as needed
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
  approveOrRejectToApi(status: boolean, type: any, data: any) {
    const body = this.returnAproveOrRejctBody(data, type, status);
    const fetchUrl = `${ActivityAPI.activityApprovrOrRejectUrl()}`;
    this.apiService.post([body], fetchUrl).subscribe(
      (res) => {
        if (res) {
          if (type == 'approve') {
            this.toastr.success('Participant Approved');
            this.getParicitpationList(this.activityId, 'normal');
          } else {
            this.toastr.error('Participant Rejected');
            this.getParicitpationList(this.activityId, 'normal');
          }
        }
      },
      () => {
        this.toastr.error('Something went wrong!');
        this.getParicitpationList(this.activityId, 'normal');
      }
    );
  }
  returnAproveOrRejctBody(data: any, type: any, status: any) {
    return {
      employeeId: data.employeeId,
      activityUUID: data.activityUUID,
      employeeName: data.employeeName,
      activityTag: data.activityTag,
      activityLocation: data.activityLocation,
      participationHours: data.participationHours,
      approvedByAdmin: type == 'approve' ? status : false,
      rejectedByAdmin: type == 'reject' ? status : false,
      employeeActivityStatus: data.employeeActivityStatus,
    };
  }
  searchParticipation() {
    if (this.searchControl.value) {
      this.isSearch = true;
      this.currentPage = 1;
      this.getParicitpationList('', 'initial');
    }
  }
  closeSearch() {
    this.searchControl.setValue('');
    this.isSearch = false;
    this.currentPage = 1;
    this.getParicitpationList('', 'initial');
  }
  onChangeState() {
    if (!this.searchControl.value) {
      this.isSearch = false;
      this.currentPage = 1;
      this.getParicitpationList('', 'initial');
    }
  }
  uploadCsv() {
    const dialogRef = this.dialog.open(ImportBulkComponent, {
      width: '470px',
      data: {
        url: `${ActivityAPI.uploadParticipantsUrl()}`,
        // heading: 'Aprrove Participation?',
        // message: `Are you sure you want to Approve ?`,
      },
    });
    dialogRef.afterClosed().subscribe((status:any) => {
      if (status) {
        this.getParicitpationList('', 'initial');
      }
    });
  }
  navigateToMyHistory(employeeId: any) {
    this.router.navigate(['/activity'], {
      queryParams: {
        empId: btoa(employeeId),
      },
    });
  }
}
