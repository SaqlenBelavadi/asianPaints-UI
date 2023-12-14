import { Injectable } from '@angular/core';
import { Roles } from '@shared/enums/role.enum';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { LocalService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppFilterService {
  filterdrpdwn$ = new BehaviorSubject<any>('');

  public filters: any = {};
  public filterValue: any = {};
  count: number = 0;
  globalFilter = new Map();

  public globalFilterArr: any;
  role: any;
  constructor(
    private storageService: LocalService,
    private apiService: ApiService
  ) {
    this.role = this.storageService.getData('Role');
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });
  }

  apply(value: any) {
    this.filterdrpdwn$.next(value);
  }

  getdrpdwnValues() {
    return this.filterdrpdwn$.asObservable();
  }

  setGlobalFilters(filterName: string, filterValue: string) {
    return this.globalFilter.set(filterName, filterValue);
  }

  unsetGlobalFilter(filterName: string) {
    return this.globalFilter.delete(filterName);
  }

  // check if there are all params met, for initial load
  globalFilterSelectAllValidity() {
    let filterEntriesSet = new Set([
      'location',
      'startDate',
      'endDate',
      'tagName',
      'activityId',
      'modeOfParticipation',
      'themeName',
    ]);
    let filterGlobalCopy = new Map(this.globalFilter);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of filterEntriesSet.entries()) {
      if (!filterGlobalCopy.has(key)) {
        return false;
      }
    }
    return true;
  }

  //isRoleSwitch is used for preventing call to api when perform a role switch.Its passing from app-layout.component.ts page.
  applyGlobalFilters(isRoleSwitch = false) {
    //
    let filterToString = ``;
    // add : for all filters except first one
    let entryIndex = 0;
    this.globalFilterArr = this.globalFilter;
    if (this.role != Roles.EMPLOYEE) {
      if (
        Array.from(this.globalFilterArr).find(
          (item: any) => item[0] == 'timerequired'
        )
      ) {
        this.globalFilter.delete('timerequired');
        this.globalFilterArr = this.globalFilter;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of this.globalFilter.entries()) {
      // if (key == 'timerequired' && this.role ==Roles.EMPLOYEE)
      if (entryIndex !== 0) filterToString += ':';
      filterToString += `${value}`.toString().trim();
      entryIndex++;
    }

    this.filterValue = filterToString;
    if (!isRoleSwitch) this.apply(filterToString);
  }
}
