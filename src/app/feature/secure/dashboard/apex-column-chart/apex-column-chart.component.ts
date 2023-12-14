import { Component, Input, ViewChild } from '@angular/core';
// import * as FileSaver from 'file-saver';
// import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { ChartComponent } from 'ng-apexcharts';
@Component({
  selector: 'app-apex-column-chart',
  templateUrl: './apex-column-chart.component.html',
  styleUrls: ['./apex-column-chart.component.scss'],
})
export class ApexColumnChartComponent  {
  /**apex chart */
  @Input() chartOptions: any;
  @Input() downloadData: any;
  @Input() type: any;
  @Input() chartNo: any;
  @ViewChild('chart') chart: ChartComponent;
  subscription: Subscription;
  counter: number = 1;
  constructor() {}

  // download(filename: any, type: any) {
  //   console.log('here in download', type);
  //   const elementHtml = document?.getElementById(`chart${type}`);
  //   if (elementHtml) {
  //     html2canvas(elementHtml).then((canvas) => {
  //       const pngData = canvas.toDataURL('image/png');
  //       FileSaver.saveAs(pngData, filename);
  //     });
  //   }

  // if (elementHtml) {
  //   const parser = new DOMParser();
  //   const element = parser.parseFromString(elementHtml, 'text/html').body
  //     .firstChild;
  //   if (element) {
  //     const serializer = new XMLSerializer();
  //     const svgData = `data:image/png+xml;charset=utf-8,${encodeURIComponent(
  //       serializer.serializeToString(element)
  //     )}`;
  //     console.log('svgData',svgData)
  //     FileSaver.saveAs(svgData, 'chart.png');
  //   }
  // }
  // }
}
