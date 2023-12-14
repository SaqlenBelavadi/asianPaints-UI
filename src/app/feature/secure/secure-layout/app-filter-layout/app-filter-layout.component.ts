import { HttpParams } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { DatePickerHeaderComponent } from '@shared/components/custom-date-range-picker/datepicker-header.component';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { LocalService } from '@core/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Roles } from '@shared/enums';
@Component({
  selector: 'app-filter-layout',
  templateUrl: './app-filter-layout.component.html',
  styleUrls: ['./app-filter-layout.component.scss'],
})
export class AppFilterLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() changedRole: any;
  activtyNameByTagArray: any[] = [];
  activtiyNameTagControl = new FormControl('');
  activityArray: any[] = [];
  modeArray: any[] = [];
  modeCacheArray: any[] = [];
  themeArray: any[] = [];
  themeCacheArray: any[] = [];
  locationArray: any[] = [];
  locationCacheArray: any[] = [];
  selectedTagsSet = new Set();
  tagActivityMap = new Map();

  requiredTimeArray: any[] = [
    'ALL',
    '0 - 2',
    '2 - 4',
    '4 - 6',
    '6 - 8',
    'Above 8',
  ];

  readonly DatePickerHeaderComponent = DatePickerHeaderComponent;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dates: any;

  isTouchUIActivated = false;
  role: any;
  activityName: any;
  isBreadcrumb: boolean = false;
  breadCrumbMain: any;
  breadCrumbSub: any;
  breadCrumbSubscription: Subscription;
  sidePanelCloseSubscription: Subscription;

  isLanding: boolean = true;

  /** control for the MatSelect filter keyword */
  public activityFilterCtrl: FormControl = new FormControl();

  /** list of activity filtered by search keyword */
  public filteredActivities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('multiSelect') multiSelect: MatSelect;
  public tagFilterControl: FormControl = new FormControl();

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  defaultLoc: any;
  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private filterService: AppFilterService,
    private storageService: LocalService,
    private route: ActivatedRoute
  ) {
    this.apiService.isLanding.subscribe((res) => {
      console.log(res, '__ADP isAdpSource');
      this.isLanding = res;
    });

    this.role = this.storageService.getData('Role');
    this.defaultLoc = this.storageService.getData('d-loc');

    this.fetchLov('Locations');
    this.fetchLov('Themes');
    this.fetchLov('Modes');
    if (this.role == this.roleEnum.EMPLOYEE) {
      this.setFilterInitial();
      // this.selectedLoc(this.defaultLoc);
    }
    // // Get the current date
    // var currentDate = moment();

    // // Determine the start and end dates of the financial year
    // var startOfFinancialYear = moment()
    //   .month(3)
    //   .date(1)
    //   .subtract(currentDate.month() < 3 ? 1 : 0, 'years');
    // var endOfFinancialYear = moment()
    //   .month(2)
    //   .date(31)
    //   .add(currentDate.month() >= 3 ? 1 : 0, 'years');

    //
    const startOfYear = moment().startOf('year').format('YYYY-MM-DD hh:mm');
    const endOfYear = moment().endOf('year').format('YYYY-MM-DD hh:mm');

    // const startOfMonth =
    //   moment(startOfFinancialYear).format('YYYY-MM-DD hh:mm');
    const start = moment(startOfYear).format('DD/MM/YYYY');
    // const endOfMonth = moment(endOfFinancialYear).format('YYYY-MM-DD hh:mm');
    const end = moment(endOfYear).format('DD/MM/YYYY');

    // for inital filter
    if (startOfYear && endOfYear) {
      this.range.controls.start.setValue(startOfYear);
      this.range.controls.end.setValue(endOfYear);
      // this.filterService.setFilter('startDate', { value: start, selected: true }, true);
      // this.filterService.setFilter('endDate', { value: end, selected: true }, true);
      let startDateFilter = `startDate=${start}`;
      let endDateFilter = `endDate=${end}`;
      this.filterService.setGlobalFilters('startDate', startDateFilter);
      this.filterService.setGlobalFilters('endDate', endDateFilter);
    }

    /**check for start date value change*/
    this.range.controls.start.valueChanges.subscribe((res: any) => {
      if (res) {
        //
        this.dates = {
          startDate: moment(res).format('DD/MM/YYYY'),
          endDate: this.range.controls.end.value
            ? moment(this.range.controls.end.value).format('DD/MM/YYYY')
            : null,
        };
      }
    });

    /**check for start date value change*/
    this.range.controls.end.valueChanges.subscribe((res: any) => {
      if (res) {
        this.dates = {
          startDate: moment(this.range.controls.start.value).format(
            'DD/MM/YYYY'
          ),
          endDate: moment(res).format('DD/MM/YYYY'),
        };

        if (this.dates.startDate && this.dates.endDate) {
          let startDateFilter = `startDate=${this.dates.startDate}`;
          let endDateFilter = `endDate=${this.dates.endDate}`;
          this.filterService.setGlobalFilters('startDate', startDateFilter);
          this.filterService.setGlobalFilters('endDate', endDateFilter);
        }
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      //
      if (params?.activityName && params?.activityUUID) {
        this.isBreadcrumb = true;
        this.activityName = params?.activityName
          ? atob(params?.activityName)
          : '';
        this.breadCrumbMain = 'Activity';
        this.breadCrumbSub = this.activityName;
      } else {
        this.isBreadcrumb = false;
      }
    });

    this.sidePanelCloseSubscription = this.apiService.sidePanelClose$.subscribe(
      (status) => {
        //
        if (
          status &&
          (this.apiService.currentRouteUrl == '/activity/activities' ||
            this.apiService.currentRouteUrl == '/activity')
        ) {
          this.updateActivityArrCreation();
        }
      }
    );
    this.breadCrumbSubscription = this.apiService.viewBreadCrumb$.subscribe(
      (status) => {
        if (
          status &&
          status?.status &&
          status?.label == 'Participation' &&
          this.role == this.roleEnum.EMPLOYEE
        ) {
          this.isBreadcrumb = true;
          this.breadCrumbMain = 'Activity';
          this.breadCrumbSub = 'Participation';
        } else if (
          status &&
          status?.status &&
          status?.label == 'ActivityDetail'
        ) {
          this.isBreadcrumb = true;
          this.breadCrumbMain = 'Activity';
          this.breadCrumbSub = status?.activityName;
        } else {
          if (this.apiService.currentRouteUrl == '/about-evp') {
            this.isBreadcrumb = true;
            this.breadCrumbMain = 'About EVP';
            this.breadCrumbSub = 'Details';
          } else if (
            this.apiService.currentRouteUrl ==
            '/admin-activity/admin-activity-list'
          ) {
            this.isBreadcrumb = true;
            this.breadCrumbMain = 'Local Admins';
            this.breadCrumbSub = '';
          } else if (
            this.apiService.currentRouteUrl == '/landing-config/banner-list'
          ) {
            this.isBreadcrumb = true;
            this.breadCrumbMain = '';
            this.breadCrumbSub = '';
          } else {
            this.isBreadcrumb = false;
          }
        }
      }
    );
  }

  public get roleEnum() {
    return Roles;
  }

  ngOnDestroy(): void {
    if (this.breadCrumbSubscription) {
      this.breadCrumbSubscription.unsubscribe();
    }
    if (this.sidePanelCloseSubscription) {
      this.sidePanelCloseSubscription.unsubscribe();
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setFilterInitial() {
    // use this to set filter global values initially
    //
    const defaultLocation = this.storageService.getData('d-loc');
    if (this.role !== Roles.CADMIN) {
      this.filterService.setGlobalFilters(
        'location',
        `location=${defaultLocation}`
      );
    }
    if (this.role === Roles.EMPLOYEE) {
      this.selectedLoc(defaultLocation);
    }
  }

  async updateActivityArrCreation() {
    let createdActivity = this.apiService.createdActivity;
    //
    if (createdActivity) {
      let isPushedToExistTag = false;

      // push newly created activity to activtyNameByTagArray
      this.activtyNameByTagArray.map((tag) => {
        //
        if (tag.tag === createdActivity.tagName) {
          tag.activities.push({
            activityId: createdActivity.activityId,
            activityName: createdActivity.activityName,
          });
          isPushedToExistTag = true;
        }
      });

      // if it's not pushed to an existing tag, create new tag with this new activity
      if (!isPushedToExistTag) {
        let tagActivity = {
          tag: createdActivity.tagName,
          activities: [
            {
              activityId: createdActivity.activityId,
              activityName: createdActivity.activityName,
            },
          ],
        };

        this.activtyNameByTagArray.push(tagActivity);
      }

      //
      await this.selectAllInitial(true);

      this.applyGlobalFilters();
    }
  }

  async ngOnInit() {
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
        this.isBreadcrumb = false;
      }
    });

    this.activityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterActivities();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('changedRole')) {
      if (this.changedRole) {
        this.setFilterInitial();
      }
    }
  }

  // need to change - gaiusmathew
  fetchLov(category: string) {
    const params = new HttpParams().set('category', category);
    const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        this.formatFetchResponse(val, category);
      },
      error: (err) => {
        this.toastr.error(err);
      },
      complete: () => {
        //
      },
    });
  }
  formatFetchResponse(val: any, category: string) {
    switch (category) {
      case 'Locations':
        this.locationArray = val.lovResponses;
        this.locationCacheArray = val.lovResponses;
        break;

      case 'Themes':
        this.themeArray = val.lovResponses;
        this.themeCacheArray = val.lovResponses;
        break;

      case 'Modes':
        this.modeArray = val.lovResponses;
        this.modeCacheArray = val.lovResponses;
        break;

      default:
        // return []
        break;
    }
    //
    return [];
  }
  protected filterActivities() {
    if (!this.activtyNameByTagArray) {
      return;
    }
    // get the search keyword
    let search = this.activityFilterCtrl.value;
    if (!search) {
      this.filteredActivities.next(this.activtyNameByTagArray.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the activities
    // this.filteredActivities.next(
    //   this.activtyNameByTagArray.filter((act: any) =>
    //     act.tag.toLowerCase().includes(search)
    //       ? act.activities
    //       : act.activities.filter((item: any) => {
    //           return item.activityName.toLowerCase().indexOf(search) > -1;
    //         })
    //   )
    // );
    this.filteredActivities.next(this._filterGroup(search));
  }
  private _filterGroup(search: string): any[] {
    if (search) {
      return this.activtyNameByTagArray
        .map((act: any) => ({
          tag: act.tag,
          activities: this._filter(act, search),
        }))
        .filter((acti: any) => acti.activities.length > 0);
    }

    return this.activtyNameByTagArray;
  }
  private _filter(grp: any, value: string): any[] {
    const filterValue = value.toLocaleLowerCase();

    return grp.tag.toLocaleLowerCase().includes(filterValue)
      ? grp.activities
      : grp.activities.filter((item: any) => {
          return item.activityName.toLocaleLowerCase().includes(filterValue);
        });
  }

  selectAllInitial(isSelected: boolean) {
    if (isSelected) {
      let allActivities: any = [];
      this.tagActivityMap.clear();
      this.activtyNameByTagArray.map((tag) => {
        // add each activity with it's corresponding tag
        tag.activities.map((act: any) => {
          this.tagActivityMap.set(act.activityId, tag.tag);
          allActivities.push(act.activityId);
        });
      });
      this.tagFilterControl.setValue(true);
      this.activtiyNameTagControl.patchValue(allActivities);
    } else {
      this.tagFilterControl.setValue(false);
      this.tagActivityMap.clear();
      this.activtiyNameTagControl.patchValue([]);
    }
    this.filteredActivities.next(this.activtyNameByTagArray.slice());
    return this.setGlobalFilters();
  }

  selectOptions(event: any, activityId: string, tagName: string) {
    let selected = event.source._selected;

    if (activityId === 'allActivities' && event.isUserInput) {
      this.selectAllInitial(selected);
    } else if (selected && event.isUserInput) {
      let controlSet = new Set(this.activtiyNameTagControl.value);
      controlSet.add(activityId);
      this.activtiyNameTagControl.patchValue(Array.from(controlSet));
      this.tagActivityMap.set(activityId, tagName);
      this.setGlobalFilters();
    } else if (!selected && event.isUserInput) {
      let controlSet = new Set(this.activtiyNameTagControl.value);
      controlSet.delete(activityId);
      this.activtiyNameTagControl.patchValue(Array.from(controlSet));
      this.tagActivityMap.delete(activityId);
      this.setGlobalFilters();
    }
  }
  toggleSelection(event: any, item: any) {
    let activityIdsArr: string[] = [];

    if (event.checked) {
      item.activities.forEach((activity: any) => {
        activityIdsArr.push(activity.activityId);
        this.tagActivityMap.set(activity.activityId, item.tag);
      });
      let controlSet: any = new Set([
        ...this.activtiyNameTagControl.value,
        ...activityIdsArr,
      ]);
      this.activtiyNameTagControl.patchValue(Array.from(controlSet));
    } else {
      item.activities.forEach((activity: any) => {
        activityIdsArr.push(activity.activityId);
        this.tagActivityMap.delete(activity.activityId);
      });
      let controlSet: any = new Set(this.activtiyNameTagControl.value);
      let newControlSet = removeAll(controlSet, activityIdsArr);
      this.activtiyNameTagControl.patchValue(Array.from(newControlSet));
    }
    this.setGlobalFilters();
  }

  async setGlobalFilters() {
    let filterSet = new Set(this.activtiyNameTagControl.value);
    filterSet.delete('allActivities');
    filterSet.delete('No Activity');
    this.tagActivityMap.delete('allActivities');
    this.tagActivityMap.delete('No Activity');
    this.selectedTagsSet.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of this.tagActivityMap.entries()) {
      this.selectedTagsSet.add(value);
    }

    if (filterSet.size) {
      let activitiesFilter = `activityId=${Array.from(filterSet)}`;
      let tagFilter = `tagName=${Array.from(this.selectedTagsSet)}`;
      this.filterService.setGlobalFilters('tagName', tagFilter);
      this.filterService.setGlobalFilters('activityId', activitiesFilter);
      let isFilterValid =
        await this.filterService.globalFilterSelectAllValidity();

      if (isFilterValid) {
        this.applyGlobalFilters();
      }
      return true;
    } else {
      this.filterService.unsetGlobalFilter('activityId');
      this.filterService.unsetGlobalFilter('tagName');
      return false;
    }
  }

  applyGlobalFilters() {
    this.filterService.applyGlobalFilters();
    return true;
  }
  selectedLoc(event: any) {
    this.fetchActivityTags('location', event);
  }
  setActivityFilterByValue() {
    if (this.activtyNameByTagArray.length) {
      this.activtyNameByTagArray.unshift({
        tag: '',
        activities: [
          {
            activityId: 'allActivities',
            activityName: 'All Activities',
          },
        ],
      });
      // this.activtiyNameTagControl.setValue([this.activtyNameByTagArray[0].activities[0]])
      // this.filterService.setFilter('activityName', { value: this.activtyNameByTagArray[0].activities[0], selected: true }, true);
      // this.filterService.setFilter('tagName', { value: this.activtyNameByTagArray[0].tag, selected: true }, true);
      this.selectAllInitial(true);
      //

      // this.applyGlobalFilters();
    } else {
      this.activtyNameByTagArray = [
        {
          tag: '',
          activities: [
            {
              activityId: 'noActivities',
              activityName: 'No Activity',
            },
          ],
        },
      ];

      this.selectAllInitial(true);
    }
  }

  fetchActivityTags(category: string, value: any) {
    const params = new HttpParams().set(`${category}`, value);
    const fetchUrl = `${ActivityAPI.activtyNameByTagUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        // this.activtyNameByTagArray = val.data ?? []
        this.formatActivityTagResponse(val.data);
      },
      error: () => {
        //
        this.activtyNameByTagArray = [];
        // this.toastr.error(err.error.message);
      },
      complete: () => {
        //
      },
    });
  }
  formatActivityTagResponse(activityTagVal: any) {
    this.activtyNameByTagArray = [];
    if (Object.keys(activityTagVal).length > 0) {
      for (const [key, value] of Object.entries(activityTagVal)) {
        this.activtyNameByTagArray.push({
          tag: key,
          activities: value,
        });
      }
    } else {
      this.activtyNameByTagArray = [];
    }
    this.setActivityFilterByValue();
    return this.activtyNameByTagArray;
  }
}

function removeAll(originalSet: Set<string>, toBeRemovedArr: Array<string>) {
  toBeRemovedArr.forEach(function (v) {
    originalSet.delete(v);
  });
  return originalSet;
}
