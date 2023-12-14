import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { AppFilterService } from '@core/services/app-filter.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-month-wise',
  templateUrl: './month-wise.component.html',
  styleUrls: ['./month-wise.component.scss'],
})
export class MonthWiseComponent implements OnInit, OnChanges {
  @Input() dashBoardMonthWiseData: any;
  noOfParticipantschartOptions: any;
  participantHourschartOptions: any;
  uniqueParticipantschartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private appFilter: AppFilterService
  ) {}

  ngOnInit(): void {
    this.getnoOfParticipantsData();
    this.getparticipantHoursData();
    this.getuniqueParticipantsData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.dashBoardMonthWiseData?.firstChange) {
      this.dashBoardMonthWiseData =
        changes?.dashBoardMonthWiseData?.currentValue;
      this.getnoOfParticipantsData();
      this.getparticipantHoursData();
      this.getuniqueParticipantsData();
    }
  }
  async getnoOfParticipantsData() {
    let labels = {
      yaxis: 'No. of Volunteers',
    };
    if (this.dashBoardMonthWiseData.noOfParticipants) {
      const objKeys = Object.keys(this.dashBoardMonthWiseData.noOfParticipants);
      if (
        objKeys &&
        objKeys.some(
          (item) =>
            Object.keys(this.dashBoardMonthWiseData.noOfParticipants[item])
              .length > 0
        )
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatColumchartData(
            this.dashBoardMonthWiseData.noOfParticipants
          );

        this.noOfParticipantschartOptions = this.loadChart(
          apexCategories,
          apexdataseries,
          labels
        );
      } else {
        this.noOfParticipantschartOptions = this.returnNoDataChart(labels);
      }
    } else {
      this.noOfParticipantschartOptions = this.returnNoDataChart(labels);
    }
  }

  async getparticipantHoursData() {
    let labels = {
      yaxis: 'No. of participated hours',
    };
    if (this.dashBoardMonthWiseData.participantHours) {
      const objKeys = Object.keys(this.dashBoardMonthWiseData.participantHours);

      if (
        objKeys &&
        objKeys.some(
          (item) =>
            Object.keys(this.dashBoardMonthWiseData.participantHours[item])
              .length > 0
        )
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatColumchartData(
            this.dashBoardMonthWiseData.participantHours
          );

        this.participantHourschartOptions = this.loadChart(
          apexCategories,
          apexdataseries,
          labels
        );
      } else {
        this.participantHourschartOptions = this.returnNoDataChart(labels);
      }
    } else {
      this.participantHourschartOptions = this.returnNoDataChart(labels);
    }
  }

  async getuniqueParticipantsData() {
    let labels = {
      yaxis: 'No. of unique volunteers',
    };
    if (this.dashBoardMonthWiseData.uniqueParticipants) {
      const objKeys = Object.keys(
        this.dashBoardMonthWiseData.uniqueParticipants
      );

      if (
        objKeys &&
        objKeys.some(
          (item) =>
            Object.keys(this.dashBoardMonthWiseData.uniqueParticipants[item])
              .length > 0
        )
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatColumchartData(
            this.dashBoardMonthWiseData.uniqueParticipants
          );

        this.uniqueParticipantschartOptions = this.loadChart(
          apexCategories,
          apexdataseries,
          labels
        );
      } else {
        this.uniqueParticipantschartOptions = this.returnNoDataChart(labels);
      }
    } else {
      this.uniqueParticipantschartOptions = this.returnNoDataChart(labels);
    }
  }

  loadChart(apexCategory: any, apexSeries: any, labels: any) {
    return {
      series: apexSeries,
      // colors:['#78AE38', '#F9A72C', '#5D417D'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: apexCategory.length > 4 ? '30%' : '4px',
        },
      },
      xaxis: {
        type: 'category',
        categories: apexCategory,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        title: {
          text: 'Employees',
        },
      },
      yaxis: {
        title: {
          text: labels.yaxis,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: false,
        position: 'bottom',
        labels: {
          colors: ['#78AE38', '#F9A72C', '#5D417D'],
          useSeriesColors: true,
        },
        // offsetY: 40
      },
      fill: {
        opacity: 1,
        colors: ['#78AE38', '#F9A72C', '#5D417D'],
      },
      dataLabels: {
        enabled: false,
      },
    };
  }

  returnNoDataChart(labels: any) {
    return {
      series: [],
      // colors:['#78AE38', '#F9A72C', '#5D417D'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '6px',
        },
      },
      xaxis: {
        type: 'category',
        categories: [],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        title: {
          text: 'Employees',
        },
      },
      yaxis: {
        title: {
          text: labels.yaxis,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: false,
        position: 'bottom',
        labels: {
          colors: ['#78AE38', '#F9A72C', '#5D417D'],
          useSeriesColors: true,
        },
        // offsetY: 40
      },
      fill: {
        opacity: 1,
        colors: ['#78AE38', '#F9A72C', '#5D417D'],
      },
      dataLabels: {
        enabled: false,
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
