import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { Roles } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // private readonly landingScreen = '/dashboard';
  private readonly landingScreen = '';
  NavigationItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private communicationService: CommunicationService,
    private toastr: ToastrService,
    private storageService: LocalService,
    private api:ApiService
  ) {}

  login(userName: string, password: string): void {
    this.authService.authenticate(userName, password).subscribe({
      next: (val: any) => {
        if (val?.accessToken !== undefined) {
          this.storageService.saveData('o-role', val.originalRole);
          const originalRole = this.storageService.getData('o-role');
          const decodedToken = this.authService.getDecodeToken(
            val.accessToken.toString()
          );
          this.storageService.saveData('auth-token', val.accessToken);
          this.storageService.saveData('auth-refreshtoken', val.refreshToken);
          this.storageService.saveData('Role', decodedToken['role']);
          // localStorage.setItem('uniqueId', decodedToken.sub);
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
          this.storageService.saveData('sub-info', JSON.stringify(userDetails));
          if (originalRole == Roles.ADMIN) {
            this.communicationService
              .get('assets/JSON/admin.json')
              .subscribe((data: any) => {
                this.storageService.saveData(
                  'NavigationItems',
                  JSON.stringify(data.NavigationItems)
                );
                // this.router.navigate(['/dashboard']);
                this.router.navigate(['/landing']);
                this.api.isLanding.next(false);
              });
          } else if (originalRole == Roles.CADMIN) {
            this.communicationService
              .get('assets/JSON/cadmin.json')
              .subscribe((data: any) => {
                this.storageService.saveData(
                  'NavigationItems',
                  JSON.stringify(data.NavigationItems)
                );
                // this.router.navigate(['/dashboard']);
                this.router.navigate(['/landing']);
                this.api.isLanding.next(false);
              });
          } else if (originalRole == Roles.EMPLOYEE) {
            this.communicationService
              .get('assets/JSON/employee.json')
              .subscribe((data: any) => {
                this.storageService.saveData(
                  'NavigationItems',
                  JSON.stringify(data.NavigationItems)
                );
                // this.router.navigate(['/activity']);
                this.router.navigate(['/landing']);
                this.api.isLanding.next(false);
              });
          } else {
            this.toastr.warning('Invalid login role.');
          }
        } else {
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err: any) => {
        this.toastr.error(
          err?.error?.reason
            ? err.error.reason
            : err.error.message
            ? err.error.message
            : 'Something went wrong !'
        );
      },
      complete: () => {},
    });
  }
}
