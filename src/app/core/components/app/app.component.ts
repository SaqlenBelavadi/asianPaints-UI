import { Component } from '@angular/core';
import {
  Event,
  NavigationStart,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { LocalService } from '@core/services/local-storage.service';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'EVP';
  constructor(
    private router: Router,
    private storageService: LocalService,
    private apiService: ApiService
  ) {

    if (!this.storageService.getData('Role')) {
      this.router.navigateByUrl('auth/login');
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // this.currentUrl = event.url;
        this.apiService.currentRouteUrl = event.url;
      }
    });

    this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.apiService.previousRouteUrl = e[0].urlAfterRedirects; // previous url
      });
  }
}
