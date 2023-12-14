import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { PagerService } from '@core/services/pager.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() page: number;
  @Input() pageSize: number;
  @Input() totalItems: number;

  @Output() pageChange = new EventEmitter<any>();
  pager: any = {};
  constructor(private pagerService: PagerService) {}
  ngOnInit(): void {
    this.pager = this.pagerService.getPager(
      this.totalItems,
      this.page,
      this.pageSize
    );
  }
  ngOnChanges(simpleChange: any) {
    if (simpleChange.totalItems) {
      this.totalItems = simpleChange.totalItems.currentValue;
      this.pager = this.pagerService.getPager(
        this.totalItems,
        this.page,
        this.pageSize
      );
    }
    if (simpleChange.page) {
      this.page = simpleChange.page.currentValue;
      this.pager = this.pagerService.getPager(
        this.totalItems,
        this.page,
        this.pageSize
      );
    }
    if (simpleChange.pageSize) {
      this.pageSize = simpleChange.pageSize.currentValue;
      this.pager = this.pagerService.getPager(
        this.totalItems,
        this.page,
        this.pageSize
      );
    }
  }

  setPage(page: number) {
    //
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.totalItems,
      page,
      this.pageSize
    );
    this.pageChange.emit({ pager: this.pager });
    // get current page of items
    //
  }
}
