import { Component, OnInit, Input } from '@angular/core';
import { AppFilterService } from '@core/services/app-filter.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-mode-wise-charts',
  templateUrl: './mode-wise-charts.component.html',
  styleUrls: ['./mode-wise-charts.component.scss'],
})
export class ModeWiseChartsComponent implements OnInit {
  @Input() modeWiseData: any;
  pieChartOptions: any;
  noOfParticipantsOptions: any;
  participantHoursOptions: any;
  uniqueParticipantsOptions: any;
  constructor(
    private appFilter: AppFilterService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // noData: {
    //   text: "There's no data",
    //   align: 'center',
    //   verticalAlign: 'middle',
    //   offsetX: 0,
    //   offsetY: 0
    //   }
    if (this.modeWiseData) {
      if (this.modeWiseData.noOfParticipants) {
        const data = this.getData(this.modeWiseData.noOfParticipants);
        this.noOfParticipantsOptions = this.getPieChartOptions(data);
      } else {
        const obj = {
          series: [],
          labels: [],
        };
        let chartData = this.getPieChartOptions(obj);
        this.noOfParticipantsOptions = chartData;
      }
      if (this.modeWiseData.participantHours) {
        const data = this.getData(this.modeWiseData.participantHours);
        this.participantHoursOptions = this.getPieChartOptions(data);
      } else {
        const obj = {
          series: [],
          labels: [],
        };
        let chartData = this.getPieChartOptions(obj);
        this.participantHoursOptions = chartData;
      }
      if (this.modeWiseData.uniqueParticipants) {
        const data = this.getData(this.modeWiseData.uniqueParticipants);
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
      colors: ['#78AE38', '#F9A72C', '#E03D29', '#F9A72C', '#E03D29'],

      fill: {
        opacity: 1,
        colors: ['#78AE38', '#F9A72C', '#E03D29', '#F9A72C', '#E03D29'],
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
