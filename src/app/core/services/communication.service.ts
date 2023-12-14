
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { AppLoaderService } from './app-loader.service';
import { RequestCacheService } from './request-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  /* Private Properties */
  private callStackCount = 0;
  private httpBackendClient: HttpClient;

  constructor(
    private httpClient: HttpClient,
    httpBackend: HttpBackend,
    private appLoaderService: AppLoaderService,
    private cacheService: RequestCacheService
  ) {
    this.httpBackendClient = new HttpClient(httpBackend);
  }

  private getClient(needAuth: boolean): HttpClient {
    return needAuth ? this.httpClient : this.httpBackendClient;
  }

  /* Public Methods */
  /**
   * To call the API endpoints
   * @param apiPath
   * @param options
   * @param loaderText
   * @param hasAuth
   * @param doCache
   * @returns
   */
  get<T>(apiPath: string, options: any = null,
    loaderText: string | any = null,
    hasAuth: boolean = true,
    doCache: boolean = false)
    : Observable<T> {
    const showLoader = loaderText ? true : false;
    const cachedResponse = this.cacheService.get(apiPath);

    if (doCache && cachedResponse) {
      return of(cachedResponse) as unknown as Observable<T>;
    } else {
      if (showLoader) { this.showLoader(loaderText); }
      return this.getClient(hasAuth)
        .get<T>(apiPath, options ?? new HttpHeaders())
        .pipe(
          tap((response: any) => {
            if (doCache) {
              this.cacheService.put(apiPath, response as any);
            }
            if (showLoader) { this.hideLoader(); }
          }),
          catchError(error => {
            if (showLoader) { this.hideLoader(); }
            return throwError(error);
          })
        );
    }
  }

  post<T>(apiPath: string,
    data: any,
    options: any = null,
    loaderText: string | any = null,
    hasAuth: boolean = true)
    : Observable<T> {
    const showLoader = loaderText ? true : false;

    if (showLoader) { this.showLoader(loaderText); }
    return this.getClient(hasAuth)
      .post<any>(apiPath, data, options ?? new HttpHeaders())
      .pipe(
        tap((response: any) => {
          if (showLoader) { this.hideLoader(); }
        }),
        catchError(error => {
          if (showLoader) { this.hideLoader(); }
          return throwError(error);
        })
      );
  }

  put<T>(apiPath: string, data: any, options: any = null, loaderText: string | any = null, hasAuth: boolean = true): Observable<T> {
    const showLoader = loaderText ? true : false;
    if (showLoader) { this.showLoader(loaderText); }
    return this.getClient(hasAuth)
      .put<any>(apiPath, data, options ?? new HttpHeaders())
      .pipe(
        tap((response: any) => {
          if (showLoader) { this.hideLoader(); }
        }),
        catchError(error => {
          if (showLoader) { this.hideLoader(); }
          return throwError(error);
        })
      );
  }

  patch<T>(apiPath: string, data: any, options: any = null, loaderText: string | any = null, hasAuth: boolean = true): Observable<T> {
    const showLoader = loaderText ? true : false;
    if (showLoader) { this.showLoader(loaderText); }
    return this.getClient(hasAuth)
      .patch<any>(apiPath, data, options ?? new HttpHeaders())
      .pipe(
        tap((response: any) => {
          if (showLoader) { this.hideLoader(); }
        }),
        catchError(error => {
          if (showLoader) { this.hideLoader(); }
          return throwError(error);
        })
      );
  }

  delete<T>(apiPath: string, options: any = null, loaderText: string | any = null, hasAuth: boolean = true): Observable<T> {
    const showLoader = loaderText ? true : false;
    if (showLoader) { this.showLoader(loaderText); }
    return this.getClient(hasAuth)
      .delete<any>(apiPath, options)
      .pipe(
        tap((data: any) => {
          if (showLoader) { this.hideLoader(); }
        }),
        catchError(error => {
          if (showLoader) { this.hideLoader(); }
          return throwError(error);
        })
      );
  }

  /* Private Methods */
  private showLoader(loaderText: string): void {
    if (this.callStackCount === 0) {
      this.appLoaderService.start(loaderText);
    }
    this.callStackCount++;
  }

  private hideLoader(): void {
    if (this.callStackCount === 1) {
      this.appLoaderService.stop();
    }
    if (this.callStackCount > 0) {
      this.callStackCount--;
    }
  }
}
