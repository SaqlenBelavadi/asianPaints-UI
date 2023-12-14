import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/user/authenticate'):
                    return authenticate();
                default:
                    return next.handle(request);
            }
        }

        // route functions
        function authenticate() {
            return ok({
                id: 1,
                username: 'testuser',
                firstName: 'Test',
                lastName: 'User',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.drDhO00ywU1JZtnkHkIkI0Dni1d3HZ1mtPTf3PLfyeY'
            })
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
        }
    }
}

export const FakeBackendInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};