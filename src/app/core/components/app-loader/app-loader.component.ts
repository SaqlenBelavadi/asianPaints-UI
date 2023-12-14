import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from '@core/services/app-loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class AppLoaderComponent implements OnInit {

  /* Public Properties */
  showLoader = false;
  loaderText!: string | null;

  /* Constructor */
  constructor(
    private appLoaderService: AppLoaderService
  ) { }

  /* Life Cycle Hooks */
  ngOnInit(): void {
    this.subscribeEvents();
  }

  /* Private Methods */
  private subscribeEvents(): void {
    this.appLoaderService.loaderVisibility$
      .subscribe((visibility: boolean) => {
        this.loaderText = this.appLoaderService.loaderText;
        this.showLoader = visibility;
      });
  }
}
