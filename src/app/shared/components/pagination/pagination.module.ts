import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { SharedModule } from '@shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [PaginationComponent],
  imports: [CommonModule, SharedModule, NgbPaginationModule],
  exports: [PaginationComponent],
})
export class PaginationModule {}
