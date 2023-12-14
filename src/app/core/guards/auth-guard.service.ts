import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalService } from '@core/services/local-storage.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private storageService: LocalService
  ) { }

  private checkGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> {

    const helper = new JwtHelperService();
    const token = this.storageService.getData('auth-token');

    if (token === null || token === undefined) {
      this.authService.logout();
      return of(false);
    }
    try {
      if (helper.isTokenExpired(token)) {
        this.authService.logout();
        return of(false);
      }

      this.authService.setProfile(token);
      return of(true);
    }
    catch (e) {
      this.authService.logout();
      return of(false);
    }
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> {
    return this.checkGuard(activatedRouteSnapshot, state);
  }
}
