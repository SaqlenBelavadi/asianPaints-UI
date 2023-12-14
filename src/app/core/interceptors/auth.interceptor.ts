import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { TokenService } from '@core/services/token.service';
import { AppLoaderService } from '@core/services/app-loader.service';
import { LocalService } from '@core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private loaderService: AppLoaderService,
    private storageService: LocalService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const unProtectedResources = ['/Login'];
    const isUnProtectedResource =
      req.headers.get('Content-Type') === 'download'
        ? true
        : unProtectedResources.filter((x: string) => req.url.includes(x))
            .length > 0;
    const modifiedReq =
      isUnProtectedResource === true ? req : this.setHeader(req);

    return next.handle(modifiedReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !modifiedReq.url.includes('Login') &&
          !modifiedReq.url.includes('RefreshToken') &&
          error.status === 401
        ) {
          return this.handle401Error(modifiedReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const username = this.storageService.getData('username');
      const refreshToken = this.tokenService.getRefreshToken();
      const accessToken = this.tokenService.getAccessToken();
      const decodedToken = this.authService.getDecodeToken(
        accessToken as string
      );
      const role = decodedToken['role'];

      return this.authService.refreshToken(username, refreshToken, role).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.tokenService.saveToken(token.accessToken);
          this.tokenService.saveRefreshToken(token.refreshToken);
          this.refreshTokenSubject.next(token.refreshToken);
          return next.handle(this.setHeader(request));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.tokenService.signOut();
          this.loaderService.loaderFlag.next(false);
          this.loaderService.stop();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.setHeader(request)))
      );
    }
  }

  /* Private Methods */
  private setHeader(req: HttpRequest<any>): HttpRequest<any> {
    let modifiedReq: HttpRequest<any> = req;
    const token = this.tokenService.getToken();

    if (!token) {
      this.authService.logout();
    }

    switch (req.method) {
      case 'GET':
      case 'DELETE':
      case 'PUT':
      case 'POST':
      case 'PATCH':
        if (req.headers.get('Content-Type') === 'undefined') {
          modifiedReq = req.clone({
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          });
        } else {
          modifiedReq = req.clone({
            headers: new HttpHeaders({
              'Content-Type':
                req.headers.get('Content-Type') ?? 'application/json',
              Authorization: `Bearer ${token}`,
            }),
          });
        }
        break;
    }
    return modifiedReq;
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
