import { Component, Input, OnInit } from '@angular/core';
import { AppFilterService } from '@core/services/app-filter.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-employee-wise',
  templateUrl: './employee-wise.component.html',
  styleUrls: ['./employee-wise.component.scss'],
})
export class EmployeeWiseComponent implements OnInit {
  @Input() dashBoardEmpWiseData: any;
  noOfActivityChartOptions: any;
  noOfHousrsChartOptions: any;
  constructor(
    private dashboardService: DashboardService,
    private appFilter: AppFilterService
  ) {}

  ngOnInit(): void {
    this.getnoOfActivityData();
    this.getnoOfHoursData();
  }

  async getnoOfActivityData() {
    let labels = {
      xaxis: 'Employees',
      yaxis: 'No of Activity',
    };
    if (Object.keys(this.dashBoardEmpWiseData.noOfActivites).length > 0) {
      const { apexCategories, apexdataseries, nameFromId } =
        await this.dashboardService.formatBasicColumchartData(
          this.dashBoardEmpWiseData.noOfActivites
        );
      //
      this.noOfActivityChartOptions = this.loadChart(
        apexCategories,
        apexdataseries,
        labels,
        nameFromId
      );
    } else {
      this.noOfActivityChartOptions = this.returnNoDataChart(labels);
    }
  }

  async getnoOfHoursData() {
    let labels = {
      xaxis: 'Employees',
      yaxis: 'No. of participated hours',
    };
    if (Object.keys(this.dashBoardEmpWiseData.noOfHours).length > 0) {
      const { apexCategories, apexdataseries, nameFromId } =
        await this.dashboardService.formatBasicColumchartData(
          this.dashBoardEmpWiseData.noOfHours
        );
      this.noOfHousrsChartOptions = this.loadChart(
        apexCategories,
        apexdataseries,
        labels,
        nameFromId
      );
    } else {
      this.noOfHousrsChartOptions = this.returnNoDataChart(labels);
    }
  }

  returnNoDataChart(labels: any) {
    return {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Employees',
        },
      },
      yaxis: {
        title: {
          text: labels.yaxis,
        },
      },
      fill: {
        opacity: 1,
        colors: ['#78AE38', '#F9A72C', '#5D417D'],
      },
      noData: {
        text: 'No data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
      },
    };
  }
  loadChart(
    apexCategories: any,
    apexdataseries: any,
    labels: any,
    nameFromId: any
  ) {
    return {
      series: apexdataseries,
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '12%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: apexCategories,
        title: {
          text: labels.xaxis,
        },
        labels: {
          show: true,
          trim: true,
          maxHeight: 100,
        },
      },
      yaxis: {
        title: {
          text: labels.yaxis,
        },
      },
      fill: {
        opacity: 1,
        colors: ['#78AE38', '#F9A72C', '#5D417D'],
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
        x: {
          formatter: function (value: any) {
            let findName = nameFromId.find((item: any) => item.id == value);
            return findName ? findName?.name : value;
          },
        },
      },
    };
  }

  downloadCsv(category: any, subcategory: any) {
    let searchCriteria = this.appFilter.filterValue;
    let filters = {
      category,
      subcategory,
      searchCriteria,
    };
    this.dashboardService.downloadCsv(filters);
  }
}
