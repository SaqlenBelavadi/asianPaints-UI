import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { SharedModule } from '@shared/shared.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';

@NgModule({
  declarations: [FinanceDetailsComponent],
  imports: [CommonModule, FinanceRoutingModule, SharedModule, PaginationModule],
})
export class FinanceModule {}
