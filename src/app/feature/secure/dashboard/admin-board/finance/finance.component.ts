import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent {
  @Input() financeDetails: any;
  displayedColumns: string[] = [
    'expense_header',
    'estimated_expense',
    'actual_expense',
  ];
  dataSource: any[] = [
    {
      column: 'material',
      ee: 0,
      ae: 0,
    },
    {
      column: 'logistic',
      ee: 0,
      ae: 0,
    },
    {
      column: 'grati',
      ee: 0,
      ae: 0,
    },
    {
      column: 'others',
      ee: 0,
      ae: 0,
    },
  ];
  constructor(private router: Router) { }

  goToFinanceDetails() {
    this.router.navigate(['/finance/finance-list'],
      // {
      //   queryParams: {
      //     activityType: btoa('PAST'),
      //   },
      // }
    );
  }
}
