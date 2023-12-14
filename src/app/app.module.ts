import { DatePipe } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { AppComponent } from '@core/components/app/app.component';
import { CoreModule } from '@core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { setAppInjector } from './core/services/app-injector.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlaySidePanelModule } from '@shared/components/overlay-side-panel/overlay-side-panel.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PagerService } from '@core/services/pager.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent
   ],
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    OverlaySidePanelModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule
  ],
  providers: [DatePipe, MatDatepickerModule, PagerService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
