import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipationListComponent } from './participation-list/participation-list.component';
import { SharedModule } from '@shared/shared.module';
import { ParticipationRoutingModule } from './participation-routing.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ImportBulkComponent } from '../knowledge-base/import-bulk/import-bulk.component';

@NgModule({
  declarations: [
    ParticipationListComponent,
    ImportBulkComponent,
  ],
  imports: [
    CommonModule,
    ParticipationRoutingModule,
    SharedModule,
    PaginationModule,
  ],
})
export class ParticipationModule {}
