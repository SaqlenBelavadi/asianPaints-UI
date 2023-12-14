import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  // constructor(private loaderService: AppLoaderService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // let errorMsg = '';
        // if (error.error instanceof ErrorEvent) {

        //   errorMsg = `Error: ${error.error.message}`;
        // } else {

        //   errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        // }

        return throwError(error);
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
