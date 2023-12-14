import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { PagerService } from '@core/services/pager.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { AddAdminActivityComponent } from '../add-admin-activity/add-admin-activity.component';

@Component({
  selector: 'app-admin-activity-details',
  templateUrl: './admin-activity-details.component.html',
  styleUrls: ['./admin-activity-details.component.scss'],
})
export class AdminActivityDetailsComponent implements OnInit {
  sideOverlayData: any;
  adminsList: any[] = [];
  displayedColumns: string[] = [
    'No',
    'Employee ID',
    'Name',
    'Activity Name',
    'Location',
    'Role',
    'Action',
  ];
  dataSource: any;

  searchControl: FormControl = new FormControl('');
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  totalLength: any;
  pageIndex = 0;

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 5;

  currentPager: any = {};

  constructor(
    private _overlaySidePanelService: OverlaySidePanelService,
    public dialog: MatDialog,
    private communicationService: CommunicationService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private pagerService: PagerService
  ) {}

  ngOnInit(): void {
    this.sideOverlayData = {
      width: '450',
      label: 'Add Admin',
    };
    this.getAdmins('initial');

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {});

    this.apiService.sidePanelClose$.subscribe((status) => {
      if (
        status &&
        this.apiService.currentRouteUrl ===
          '/admin-activity/admin-activity-list'
      ) {
        this.currentPage = 1;
        this.getAdmins('normal');
      }
    });
  }

  getAdmins(type: any) {
    this.communicationService
      .get(
        `${AdminActivityAPI.getAdminUrl()}?pageNo=${
          this.currentPage
        }&pageSize=${this.pageSize}`,
        {},
        true
      )
      .subscribe({
        next: (val: any) => {
          // this.adminsList = val.data?.employeeList ?? [];
          // this.dataSource = this.adminsList;
          // this.totalLength = val.data?.totalElements || 0;
          // this.dataSource.paginator = this.paginator;
          this.totalItems = val?.data?.totalElements;
          this.setPage(this.currentPage, val?.data?.employeeList, type);
          let data = {
            status: true,
          };
          this.apiService.viewBreadCrumb$.next(data);
        },
        error: () => {
          this.setPage(1, [], type);
        },
        complete: () => {},
      });
  }

  getEmployeeDetailsById(type: any) {
    let empId = this.searchControl.value;
    if (empId) {
      this.communicationService
        .get(
          `${AdminActivityAPI.getAdminUrl()}?pageNo=${
            this.currentPage
          }&pageSize=${this.pageSize}&employeeId=${empId.toString()}`,
          {},
          true
        )
        .subscribe({
          next: (val: any) => {
            // this.adminsList = [val.data || ''];
            // this.dataSource = this.adminsList;
            // this.totalLength = 1;
            // this.dataSource.paginator = this.paginator;
            this.totalItems = val?.data?.totalElements;
            this.currentPage = 1;
            this.setPage(this.currentPage, val?.data?.employeeList, type);
          },
          error: () => {
            this.setPage(1, [], type);
          },
          complete: () => {},
        });
    } else {
      this.getAdmins('normal');
      // this.toastr.warning(`Please enter an employee ID`);
    }
  }
  searchAdmins() {
    if (this.searchControl.value) {
      this.currentPage = 1;
      this.getEmployeeDetailsById('initial');
    }
  }
  closeSearch() {
    this.searchControl.setValue('');
    this.currentPage = 1;
    this.getAdmins('initial');
  }
  onChangeState() {
    if (!this.searchControl.value) {
      this.currentPage = 1;
      this.getAdmins('initial');
    }
  }
  setPage(page: number, val: any, type: any) {
    //

    if (type == 'initial') {
      this.currentPager = this.pagerService.getPager(
        this.totalItems,
        page,
        this.pageSize
      );
    }
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
      this.currentPage = event.pager.currentPage;

      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      if (this.searchControl.value) {
        this.getEmployeeDetailsById('normal');
      } else {
        this.getAdmins('normal');
      }
    }
  }

  addAdminActivity() {
    this._overlaySidePanelService.setContent(AddAdminActivityComponent);
    this._overlaySidePanelService.show();
  }

  delete(admin: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
      data: {
        heading: 'Delete Admin?',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.deleteAdmin(admin.employeeId);
      }
    });
  }

  deleteAdmin(adminId: any) {
    this.communicationService
      .delete(
        `${AdminActivityAPI.getAdminUrl()}?employeeId=${adminId}`,
        {},
        true
      )
      .subscribe({
        next: () => {
          this.toastr.success(`Successfully deleted admin with id ${adminId}`);
          this.getAdmins('normal');
        },
        error: () => {},
        complete: () => {},
      });
  }
}
