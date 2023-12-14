import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminActivityRoutingModule } from './admin-activity-routing.module';
import { AdminActivityDetailsComponent } from './admin-activity-details/admin-activity-details.component';
import { AddAdminActivityComponent } from './add-admin-activity/add-admin-activity.component';
import { SharedModule } from '@shared/shared.module';
import { OverlaySidePanelModule } from '@shared/components/overlay-side-panel/overlay-side-panel.module';
import { PromotionsComponent } from './promotions/promotions.component';
import { AddPromotionsComponent } from './promotions/add-promotions/add-promotions.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';

@NgModule({
  declarations: [
    AdminActivityDetailsComponent,
    AddAdminActivityComponent,
    PromotionsComponent,
    AddPromotionsComponent,
  ],
  imports: [
    CommonModule,
    AdminActivityRoutingModule,
    SharedModule,
    OverlaySidePanelModule,
    PaginationModule,
  ],
})
export class AdminActivityModule {}
