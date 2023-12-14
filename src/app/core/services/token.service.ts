import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from './local-storage.service';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const ACCESS_TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private router: Router, private storageService: LocalService) {}
  signOut(): void {
    this.storageService.clearData();
    this.router.navigate(['/auth/login']);
  }

  public saveToken(token: string): void {
    this.storageService.removeData(TOKEN_KEY);
    this.storageService.saveData(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return this.storageService.getData(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    this.storageService.removeData(REFRESHTOKEN_KEY);
    this.storageService.saveData(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return this.storageService.getData(REFRESHTOKEN_KEY);
  }
  public getAccessToken(): string | null {
    return this.storageService.getData(ACCESS_TOKEN_KEY);
  }
}
