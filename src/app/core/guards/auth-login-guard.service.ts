
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '@core/services/api.service';
import { LocalService } from '@core/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthLoginGuardService implements CanActivate {

  constructor(public router: Router, private storageService: LocalService, private apiService:ApiService) { }

  canActivate(): boolean {
    const helper = new JwtHelperService();
    const token = this.storageService.getData('auth-token');
    try {
      if (token !== null || token !== undefined) {
        helper.decodeToken(token as string);
        if (helper.isTokenExpired(token)) {
          return true;
        }
        else {
          // this.router.navigate(['/dashboard']);
          this.router.navigate(['/landing']);
          this.apiService.isLanding.next(false);
          return true;
        }
      }
      return true
    }
    catch (e) {
      return true;
    }
  }
}