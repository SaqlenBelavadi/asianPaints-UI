import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { SharedModule } from '@shared/shared.module';
import { SectionConfigComponent } from './section-config/section-config.component';
import { ImportBulkComponent } from './import-bulk/import-bulk.component';


@NgModule({
  declarations: [
    SectionConfigComponent,
    ImportBulkComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    KnowledgeBaseRoutingModule,
  ]
})
export class KnowledgeBaseModule { }
