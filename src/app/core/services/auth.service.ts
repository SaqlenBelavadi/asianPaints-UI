import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserAPI } from '@shared/constants/api-endpoints/user-api.const';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfig } from '../configs';
import { CommunicationService } from './communication.service';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/feature/public/login/user.models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { LocalService } from './local-storage.service';
import { AppLoaderService } from './app-loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User = new User();
  constructor(
    private communicationService: CommunicationService,
    private router: Router,
    private apiService: ApiService,
    private storageService: LocalService,
    private loaderService: AppLoaderService
  ) {
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        let token = this.storageService.getData('auth-token');
        this.setProfile(token);
      }
    });
  }

  authenticate(userName: string, password: string): Observable<any> {
    return this.communicationService
      .post<any>(
        UserAPI.authenticateUserUrl(),
        {
          username: userName,
          password: password,
        },
        {},
        true
      )
      .pipe(
        tap((response: any) => {
          if (response) {
            this.storageService.saveData(AppConfig.auth.token, response.token);
          }
        })
      );
  }

  switchProfile(
    userName: string,
    switchProfile: boolean,
    roleToSwitch: string
  ): Observable<any> {
    return this.communicationService
      .post<any>(UserAPI.switchApinUrl(), {
        username: userName,
        switchProfile: switchProfile,
        roleToSwitch: roleToSwitch,
      })
      .pipe(
        tap((response: any) => {
          if (response) {
            this.storageService.saveData(AppConfig.auth.token, response.token);
          }
        })
      );
  }

  isLoggedIn(): boolean {
    return true;
  }

  logout(): void {
    this.storageService.clearData();
    // this.user = null;
    this.router.navigate(['/auth/login']);
    this.loaderService.stop();
  }

  getDecodeToken(token: string) {
    return jwt_decode(token) as any;
  }

  refreshToken(
    username: string | null,
    refreshToken: string | null,
    assignedRole: string
  ): Observable<any> {
    return this.communicationService
      .post<any>(UserAPI.refreshTokenUrl(), {
        username: username,
        refreshToken: refreshToken,
        assignedRole: assignedRole,
      })
      .pipe(
        tap((response: any) => {
          if (response) {
            this.storageService.saveData(AppConfig.auth.token, response.token);
          }
        })
      );
  }

  setProfile(token: any): void {
    const helper = new JwtHelperService();
    const tokenData = helper.decodeToken(token);
    this.user = new User();
    this.user.email = tokenData.sub;
    this.user.roles = [tokenData.role] as any[];
  }

  getProfile(): User {
    return this.user;
  }
}
