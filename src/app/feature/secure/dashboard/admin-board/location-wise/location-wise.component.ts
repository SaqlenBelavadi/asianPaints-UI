import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { AppFilterService } from '@core/services/app-filter.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-location-wise',
  templateUrl: './location-wise.component.html',
  styleUrls: ['./location-wise.component.scss'],
})
export class LocationWiseComponent implements OnInit, OnChanges {
  @Input() dashBoardLocWiseData: any;
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
    if (!changes?.dashBoardLocWiseData?.firstChange) {
      this.dashBoardLocWiseData = changes?.dashBoardLocWiseData?.currentValue;
      this.getnoOfParticipantsData();
      this.getparticipantHoursData();
      this.getuniqueParticipantsData();
    }
  }

  async getnoOfParticipantsData() {
    let labels = {
      yaxis: 'No of Volunteers',
    };
    if (this.dashBoardLocWiseData.noOfParticipants) {
      const objKeys = Object.keys(this.dashBoardLocWiseData.noOfParticipants);
      if (
        objKeys &&
        objKeys.some(
          (item) =>
            Object.keys(this.dashBoardLocWiseData.noOfParticipants[item])
              .length > 0
        )
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatColumchartData(
            this.dashBoardLocWiseData.noOfParticipants
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
    if (this.dashBoardLocWiseData.participantHours) {
      const objKeys = Object.keys(this.dashBoardLocWiseData.participantHours);
      if (
        objKeys &&
        objKeys.some(
          (item) =>
            Object.keys(this.dashBoardLocWiseData.participantHours[item])
              .length > 0
        )
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatColumchartData(
            this.dashBoardLocWiseData.participantHours
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
      unique: false,
      yaxis: 'No. of unique Volunteers',
    };
    if (this.dashBoardLocWiseData.uniqueParticipants) {
      const objKeys = Object.keys(this.dashBoardLocWiseData.uniqueParticipants);
      if (
        objKeys &&
        Object.keys(this.dashBoardLocWiseData.uniqueParticipants).length > 0
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatUniqueValueColumnChart(
            this.dashBoardLocWiseData.uniqueParticipants
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
  async loadTotalVsUnique($event: any) {
    if ($event.checked) {
      let labels = {
        unique: true,
        yaxis: 'No. of unique volunteers',
      };
      if (
        Object.keys(this.dashBoardLocWiseData.totalVsParticipatedMap).length > 0
      ) {
        const { apexCategories, apexdataseries } =
          await this.dashboardService.formatTotalVsUniqueValueColumnChart(
            this.dashBoardLocWiseData.totalVsParticipatedMap,
            'location'
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
      this.getuniqueParticipantsData();
    }
  }

  loadChart(apexCategory: any, apexSeries: any, labels: any) {
    return {
      series: apexSeries,
      // colors:['#78AE38', '#F9A72C', '#5D417D'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: !labels?.unique ? true : false,
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
          text: 'Location',
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
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
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
          // columnWidth: '6px',
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
          text: 'Department',
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
  downloadPng(fileName: string, type: any) {
    this.dashboardService.downloadPng(fileName, type);
  }
}
