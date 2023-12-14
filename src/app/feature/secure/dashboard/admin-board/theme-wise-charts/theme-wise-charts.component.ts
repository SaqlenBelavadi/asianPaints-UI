import { Component, OnInit, Input } from '@angular/core';
import { AppFilterService } from '@core/services/app-filter.service';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-theme-wise-charts',
  templateUrl: './theme-wise-charts.component.html',
  styleUrls: ['./theme-wise-charts.component.scss'],
})
export class ThemeWiseChartsComponent implements OnInit {
  @Input() themeWiseData: any;
  pieChartOptions: any;
  noOfParticipantsOptions: any;
  participantHoursOptions: any;
  uniqueParticipantsOptions: any;
  constructor(
    private appFilter: AppFilterService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    if (this.themeWiseData) {
      this.getNoOfParticipants();
      this.getParticipantHours();
      this.getUniqueParticipants();
    }
  }
  getData(chartData: any) {
    let labels: any[] = [];
    let series: any[] = [];
    if (chartData) {
      Object.keys(chartData).map((key) => {
        labels.push(key);
        series.push(chartData[key]);
      });
      const data = {
        labels: labels,
        series: series,
      };
      return data;
    } else {
      const data = {
        labels: [],
        series: [],
      };
      return data;
    }
  }
  getNoOfParticipants() {
    if (this.themeWiseData.noOfParticipants) {
      const data = this.getData(this.themeWiseData.noOfParticipants);
      this.noOfParticipantsOptions = this.getPieChartOptions(data);
    } else {
      const obj = {
        series: [],
        labels: [],
      };
      let chartData = this.getPieChartOptions(obj);
      this.noOfParticipantsOptions = chartData;
    }
  }
  getParticipantHours() {
    if (this.themeWiseData.participantHours) {
      const data = this.getData(this.themeWiseData.participantHours);
      this.participantHoursOptions = this.getPieChartOptions(data);
    } else {
      const obj = {
        series: [],
        labels: [],
      };
      let chartData = this.getPieChartOptions(obj);
      this.participantHoursOptions = chartData;
    }
  }
  getUniqueParticipants() {
    if (this.themeWiseData.uniqueParticipants) {
      const data = this.getData(this.themeWiseData.uniqueParticipants);
      this.uniqueParticipantsOptions = this.getPieChartOptions(data);
    } else {
      const obj = {
        series: [],
        labels: [],
      };
      let chartData = this.getPieChartOptions(obj);
      this.uniqueParticipantsOptions = chartData;
    }
  }
  getPieChartOptions(data: any) {
    return {
      series: data.series,
      chart: {
        width: 380,
        type: 'pie',
        toolbar: {
          show: true,
        },
      },
      legend: {
        show: true,
        position:'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opt: any) {
          return `${opt.w.config.series[opt.seriesIndex]}(${val.toFixed(2)}%)`;
        },
        style: {
          fontSize: '12',
          colors: ['#000000'],
        },
      },
      colors: [
        '#388560',
        '#F9A72C',
        '#FFD400',
        '#cada29',
        '#90bc36',
        '#90bc36',
      ],

      fill: {
        opacity: 1,
        colors: [
          '#388560',
          '#F9A72C',
          '#FFD400',
          '#cada29',
          '#90bc36',
          '#90bc36',
        ],
      },
      labels: data.labels,

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: true,
              position: 'bottom',
            },
            // color: ['#78AE38', '#F9A72C', '#E03D29', '#F9A72C', '#E03D29']
          },
        },
      ],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -10,
            minAngleToShowLabel: 10,
          },
        },
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
