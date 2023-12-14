import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppLoaderService } from '@core/services/app-loader.service';
import { AuthService } from '@core/services/auth.service';
import { CommunicationService } from '@core/services/communication.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, shareReplay } from 'rxjs';
import { LoginService } from 'src/app/feature/public/login/login.service';
import { SharedService } from '../../secure-shared/service/shared.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Roles } from '@shared/enums/role.enum';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  teamsEmail: string = environment.teamsEmail;
  /* Public Properties */
  navigationItems: any = [];
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  showNoti = false;
  showInco = false;
  role: any;
  showHlp = false;
  userStatus = true;
  showActiveAgents: boolean = false;
  incomingUserData: any;
  originalRole: any;

  selectedMenu: any;
  activityMenuClickCount: number = 0;
  participationMenuClickCount: number = 0;

  loginUserDetails: any;
  userName: any;

  isLanding:boolean=true;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    public sharedService: SharedService,
    public loginService: LoginService,
    private apiService: ApiService,
    private communicationService: CommunicationService,
    private loaderService: AppLoaderService,
    private toastr: ToastrService,
    private storageService: LocalService,
    private filterService: AppFilterService
  ) {
    // let dLocation = this.storageService.getData('d-loc');
    this.role = this.storageService.getData('Role');

    // if (dLocation && !this.roleEnum.CADMIN) {
    //   this.fetchActivityTags('location', this.storageService.getData('d-loc'));
    // } else if (this.role === this.roleEnum.CADMIN) {
    //   this.fetchLov();
    // }
  }

  /* Public Methods */

  get roleEnum() {
    return Roles;
  }

  ngOnInit(): void {
    const value: any = this.storageService.getData('NavigationItems');
    this.navigationItems = JSON.parse(value);
    this.originalRole = this.storageService.getData('o-role');
    this.loginUserDetails = JSON.parse(this.storageService.getData('sub-info'));
    this.userName = this.storageService.getData('username');
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.navigationItems = JSON.parse(
          this.storageService.getData('NavigationItems') as string
        );
        this.role = this.storageService.getData('Role');
        this.loginUserDetails = JSON.parse(
          this.storageService.getData('sub-info')
        );
        this.loaderService.stop();
      }
    });

  }

  gotoProfile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.authService.logout();
  }

  switchProfile(roleToSwitch: string) {
    this.loaderService.start();
    setTimeout(() => {
      // if (type == 'employee') {
      this.storageService.removeData('Role');
      // this.storageService.saveData('Role', roleEnum.EMPLOYEE);
      this.storageService.removeData('NavigationItems');
      const username = this.storageService.getData('username') as string;

      this.authService.switchProfile(username, true, roleToSwitch).subscribe({
        next: (val: any) => {
          if (val?.accessToken !== undefined) {
            const decodedToken = this.authService.getDecodeToken(
              val.accessToken.toString()
            );
            this.authService.setProfile(val?.accessToken);
            // if (decodedToken.status == 'A') {
            this.storageService.saveData('o-role', val.originalRole);

            this.storageService.saveData('auth-token', val.accessToken);
            this.storageService.saveData('auth-refreshtoken', val.refreshToken);
            this.storageService.saveData('Role', decodedToken['role']);
            // this.storageService.saveData('uniqueId', decodedToken.sub);
            this.storageService.saveData('username', val.username);
            this.storageService.saveData('d-loc', val.defaultLocation);
            const userDetails = {
              email: val.email,
              employeecode: val.employeecode,
              officialMobile: val.officialMobile,
              personalMobile: val.personalMobile,
              name: val.name,
              totalActivityParticipated: val.totalActivityParticipated,
              totalHoursParticipated: val.totalHoursParticipated,
              centralPhoneNumber: val.centralPhoneNumber,
              centralEmailId: val.emailId,
            };
            this.storageService.saveData(
              'sub-info',
              JSON.stringify(userDetails)
            );
            if (decodedToken['role'] == this.roleEnum.ADMIN) {
              this.removeTimeRequiredForAdmins(this.filterService.globalFilter);
              this.communicationService
                .get('assets/JSON/admin.json')
                .subscribe((data: any) => {
                  this.storageService.saveData(
                    'NavigationItems',
                    JSON.stringify(data.NavigationItems)
                  );
                  this.apiService.switchProfiles();
                  // this.router.navigate(['/dashboard']);
                  this.handleImageClick();
                });
            } else if (decodedToken['role'] == this.roleEnum.EMPLOYEE) {
              this.communicationService
                .get('assets/JSON/employee.json')
                .subscribe((data: any) => {
                  this.storageService.saveData(
                    'NavigationItems',
                    JSON.stringify(data.NavigationItems)
                  );
                  this.apiService.switchProfiles();
                  // this.router.navigate(['/activity/activities']);
                  this.handleImageClick();
                });
            } else if (decodedToken['role'] == this.roleEnum.CADMIN) {
              this.removeTimeRequiredForAdmins(this.filterService.globalFilter);
              this.communicationService
                .get('assets/JSON/cadmin.json')
                .subscribe((data: any) => {
                  this.storageService.saveData(
                    'NavigationItems',
                    JSON.stringify(data.NavigationItems)
                  );
                  this.apiService.switchProfiles();
                  // this.router.navigate(['/dashboard']);
                  this.handleImageClick();
                });
            } else {
              this.toastr.warning('Invalid login role.');
              this.authService.logout();
            }
          }
        },
        error: (err: any) => {
          this.toastr.error(
            err?.error?.title ? err.error.title : 'Something went wrong !'
          );
          this.authService.logout();
        },
        complete: () => {},
      });
    }, 1000);
  }
  removeTimeRequiredForAdmins(filters: any) {
    if (filters) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let [key, value] of filters.entries()) {
        if (key == 'timerequired') {
          filters.delete(key);
        }
      }
    }
    this.filterService.globalFilter = filters;
    this.filterService.applyGlobalFilters(true);
  }

  // fetchLov() {
  //   const params = new HttpParams().set('category', 'Locations');
  //   const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
  //   this.apiService.get(fetchUrl).subscribe({
  //     next: (val) => {
  //       let locationsArr = val.lovResponses;
  //       let locationsToFilterArr = locationsArr.map(
  //         (location: any) => location.lovValue
  //       );
  //       this.fetchActivityTagForAllLocations(`${locationsToFilterArr}`);
  //     },
  //     error: (err) => {
  //       this.toastr.error(err);
  //     },
  //     complete: () => {
  //       //
  //     },
  //   });
  // }

  // fetchActivityTags(category: string, value: any) {
  //   const params = new HttpParams().set(`${category}`, value);
  //   const fetchUrl = `${ActivityAPI.activtyNameByTagUrl()}?${params.toString()}`;
  //   this.apiService.get(fetchUrl).subscribe({
  //     next: (val) => {
  //       // this.activtyNameByTagArray = val.data ?? []
  //       this.formatActivityTagResponse(val.data);
  //     },
  //     error: (err) => {
  //       //
  //       this.activtyNameByTagArray = [];
  //       // this.toastr.error(err.error.message);
  //     },
  //     complete: () => {
  //       //
  //     },
  //   });
  // }

  // fetchActivityTagForAllLocations(locationParams: string) {
  //   const fetchUrl = `${ActivityAPI.activtyNameByTagUrl()}?location=${locationParams}`;
  //   this.apiService.get(fetchUrl).subscribe({
  //     next: (val) => {
  //       // this.activtyNameByTagArray = val.data ?? []
  //       this.formatActivityTagResponse(val.data);
  //     },
  //     error: (err) => {
  //       //
  //       this.activtyNameByTagArray = [];
  //       // this.toastr.error(err.error.message);
  //     },
  //     complete: () => {
  //       //
  //     },
  //   });
  // }

  // formatActivityTagResponse(activityTagVal: any) {
  //   if (activityTagVal) {
  //     for (const [key, value] of Object.entries(activityTagVal)) {
  //       this.activtyNameByTagArray.push({
  //         tag: key,
  //         activities: value,
  //       });
  //     }
  //   } else {
  //     this.activtyNameByTagArray = [];
  //   }
  //   return this.activtyNameByTagArray;
  // }

  handleClick(selectedItem: any) {
    this.selectedMenu = selectedItem;
    this.filterService.applyGlobalFilters();
  }

  returnShortName(name: string) {
    return name.split(' ').map((n) => n[0]).length > 2
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
      : name
          .split(' ')
          .map((n) => n[0])
          .join('');
  }
  navigateToMyHistory() {
    this.router.navigate(['/activity'], {
      queryParams: {
        empId: btoa(this.loginUserDetails.employeecode),
      },
    });
  }
  onMenuClick() {
    this.apiService.viewBreadCrumb$.next({ status: false });
  }
  returnFromattedHrsMnts(value: any) {
    if (value) {
      let splittedItems = value.split('.');
      if (splittedItems.length == 2) {
        return splittedItems[0] + ' Hrs ' + splittedItems[1] + ' mins ';
      } else {
        return '0';
      }
    } else {
      return '0';
    }
    return '0';
  }

  handleImageClick(): void {
    this.router.navigate(['/landing']);
    this.apiService.isLanding.next(false);
  }
}
