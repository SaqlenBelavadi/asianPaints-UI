import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { PagerService } from '@core/services/pager.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { Roles } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';
import { AddActivityComponent } from '../add-activity/add-activity.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  sideOverlayData: any;
  displayedColumns: string[] = ['activity', 'count', 'edit'];
  dataSource: any = [];
  role: any;
  selectedTabIndex: number = 0;
  activtySearchParam: any;

  activityDetails: any[] = [];
  createdActivities: any[] = [];
  ongoingActivities: any[] = [];
  pastActivities: any[] = [];
  upcomingActivities: any[] = [];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[] = [];

  currentPage: number = 1;
  totalItems: number = 10;
  pageSize: number = 3;
  // subscription: Subscription;
  isHistory: boolean = false;
  previousUrl: any;
  isAddActivity: boolean = false;
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
    private route: ActivatedRoute
  ) {
    
    // this.sideOverlayData = {
    //   width: '950',
    //   label: 'Create Activity',
    //   isEdit: false,
    //   data: {},
    // };
    // if (this.apiService.isActivityEdit) {
    //   this.sideOverlayData.label = 'Edit Actitivty';
    // }
  }

  public get roleEnum(): typeof Roles {
    return Roles; 
  }

  async ngOnInit() {
    this.role = this.storageService.getData('Role');
    this.previousUrl = this.apiService.previousRouteUrl;

    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      //
      const employeeId = params?.empId;
      if (employeeId) {
        this.isHistory = true;
      }
    });
    this.apiService.activityEditFromList$.subscribe((status) => {
      if (status) {
        this.isAddActivity = true;
        this.sideOverlayData = {
          width: '950',
          label: 'Edit Activity',
          isEdit: true,
          data: {},
        };
      }
    });
    this.apiService.activityConfrimParticipationList$.subscribe((status) => {
      if (status) {
        this.isAddActivity = true;
        this.sideOverlayData = {
          width: '750',
          label: 'Add Feedback',
          isEdit: false,
          data: {},
        };
      }
    });
  }

  addActivity() {
    this.isAddActivity = true;

    this.sideOverlayData = {
      width: '950',
      label: 'Create Activity',
      isEdit: false,
      data: {},
    };
    this._overlaySidePanelService.setContent(AddActivityComponent);
    this._overlaySidePanelService.show();
  }

  onTabChanged(event: any) {
    
    let clickedIndex = event.index;
    this.selectedTabIndex = clickedIndex;
  }
}
