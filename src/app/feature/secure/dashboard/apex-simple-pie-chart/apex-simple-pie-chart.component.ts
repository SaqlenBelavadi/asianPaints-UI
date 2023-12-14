import { Component, Input, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
// import * as FileSaver from 'file-saver';
// import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { DashboardService } from '../admin-board/dashboard.service';

@Component({
  selector: 'app-apex-simple-pie-chart',
  templateUrl: './apex-simple-pie-chart.component.html',
  styleUrls: ['./apex-simple-pie-chart.component.scss'],
})
export class ApexSimplePieChartComponent {
  @Input() chartOptions: any;
  @ViewChild('chart') chart: ChartComponent;
  subscription: Subscription;
  constructor(private dashboardService: DashboardService) {
    // this.subscription = this.dashboardService.pngDownloadData$.subscribe(
    //   (res) => {
    //     if (res?.status) {
    //       this.download(res?.filename);
    //     }
    //   }
    // );
  }

  // download(filename: string) {
  //   const elementHtml = document?.getElementById('chart');
  //   if (elementHtml) {
  //     html2canvas(elementHtml).then((canvas) => {
  //       const pngData = canvas.toDataURL('image/png');
  //       FileSaver.saveAs(pngData, 'chart.png');
  //     });
  //   }
  // }
}
