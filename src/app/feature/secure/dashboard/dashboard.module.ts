import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexColumnChartComponent } from './apex-column-chart/apex-column-chart.component';
import { ApexSimplePieChartComponent } from './apex-simple-pie-chart/apex-simple-pie-chart.component';
import { DepartmentWiseChartsComponent } from './admin-board/department-wise-charts/department-wise-charts.component';
import { ThemeWiseChartsComponent } from './admin-board/theme-wise-charts/theme-wise-charts.component';
import { ModeWiseChartsComponent } from './admin-board/mode-wise-charts/mode-wise-charts.component';
import { FinanceComponent } from './admin-board/finance/finance.component';
import { LocationWiseComponent } from './admin-board/location-wise/location-wise.component';
import { MonthWiseComponent } from './admin-board/month-wise/month-wise.component';
import { EmployeeWiseComponent } from './admin-board/employee-wise/employee-wise.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminBoardComponent,
    ApexColumnChartComponent,
    ApexSimplePieChartComponent,
    DepartmentWiseChartsComponent,
    ThemeWiseChartsComponent,
    ModeWiseChartsComponent,
    FinanceComponent,
    LocationWiseComponent,
    MonthWiseComponent,
    EmployeeWiseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    PaginationModule,
  ],
})
export class DashboardModule {}
