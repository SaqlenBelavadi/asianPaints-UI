import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public pngDownloadData$ = new Subject<any>();
  constructor(
    private communicationService: CommunicationService,
    private apiService: ApiService
  ) {}

  async formatColumchartData(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      let mainKeyCat: any = Object.keys(data);
      let seconKeyseries: any[] = [];
      let mainSeriesloaded: any[] = [];

      for (let objLoo in data) {
        let vari = Object.keys(data[objLoo]);
        if (vari.length > 0) {
          seconKeyseries.push(...vari);
        }
      }
      seconKeyseries = [...new Set(seconKeyseries)];
      for (let i = 0; i < seconKeyseries.length; i++) {
        let addSeries: any[] = [];
        let name: any = '';

        for (let j = 0; j < mainKeyCat.length; j++) {
          name = seconKeyseries[i];
          if (seconKeyseries[i] in data[mainKeyCat[j]]) {
            addSeries.push(data[mainKeyCat[j]][seconKeyseries[i]]);
          } else {
            addSeries.push(0);
          }
        }

        mainSeriesloaded.push({
          name: name,
          data: addSeries,
        });
      }

      resolve({
        apexCategories: mainKeyCat,
        apexdataseries: mainSeriesloaded,
      });
    }).then((res: any) => {
      return {
        apexCategories: res.apexCategories,
        apexdataseries: res.apexdataseries,
      };
    });
  }

  async formatTotalVsUniqueValueColumnChart(data: any, type: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      let itemData = data;
      const apexCategories = Object.keys(itemData).filter((i) => {
        return i != 'null';
      });

      let total: [] | any = [];
      let unique: [] | any = [];
      for (let itemName in itemData) {
        let ObjectKeyValue = Object.keys(itemData[itemName])[0]
          ? Object.keys(itemData[itemName])[0]
          : '0';
        total.push(parseInt(ObjectKeyValue));
        let itemKeyValue: any = Object.keys(itemData[itemName]);
        unique.push(
          itemKeyValue.length > 0 ? itemData[itemName][itemKeyValue] : 0
        );
      }

      if (apexCategories.length > 0) {
        resolve({
          apexCategories: apexCategories,
          apexdataseries: [
            {
              name: 'Unique Value',
              data: type == 'department' ? unique : total, // for location swap the values
            },
            {
              name: 'Total Value',
              data: type == 'department' ? total : unique, // for location swap the values
            },
          ],
        });
      }
    }).then((res: any) => {
      return {
        apexCategories: res.apexCategories,
        apexdataseries: res.apexdataseries,
      };
    });
  }
  async formatUniqueValueColumnChart(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      let itemData = data;
      const apexCategories = Object.keys(itemData).filter((i) => {
        return i != 'null';
      });
      let total: [] | any = [];
      for (let itemName in itemData) {
        let ObjectKeyValue = itemData[itemName];
        total.push(parseInt(ObjectKeyValue));
      }
      if (apexCategories.length > 0) {
        resolve({
          apexCategories: apexCategories,
          apexdataseries: [
            {
              name: 'Total Value',
              data: total,
            },
          ],
        });
      }
    }).then((res: any) => {
      return {
        apexCategories: res.apexCategories,
        apexdataseries: res.apexdataseries,
      };
    });
  }

  async formatBasicColumchartData(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      let itemData = data;
      const apexCategories = Object.keys(itemData).filter((i) => {
        return i != 'null';
      });
      let apexdata: any[] = [];
      let nameFromId: any[] = [];
      apexCategories.map((catItem: any, catIndex: any) => {
        if (itemData[catItem]) {
          if (Object.keys(itemData[catItem]).length > 0) {
            Object.keys(itemData[catItem]).map(
              (innerItem: any) => {
                let findDup = nameFromId.find(
                  (item) => item.id == itemData[catItem]
                );
                if (!findDup) {
                  nameFromId.push({
                    id: catItem,
                    name: innerItem,
                  });
                }

                let innerItemValue = itemData[catItem][innerItem];
                apexdata.push(innerItemValue);
              }
            );
          }
        }
        if (apexCategories.length - 1 == catIndex) {
          resolve({
            apexCategories: apexCategories,
            apexdataseries: [
              {
                name: 'Count',
                data: apexdata,
              },
            ],
            nameFromId: nameFromId,
          });
        }
      });
    }).then((res: any) => {
      return {
        apexCategories: res.apexCategories,
        apexdataseries: res.apexdataseries,
        nameFromId: res.nameFromId,
      };
    });
  }

  async downloadCsv(filters: any) {
    const params = new HttpParams()
      .set('searchCriteria', filters.searchCriteria)
      .set('category', filters.category)
      .set('subcategory', filters.subcategory);

    const fetchUrl = `${AdminActivityAPI.dashboardCsvDownloadUrl()}?${params}`;
    this.communicationService
      .post(fetchUrl, '', { responseType: 'text' })
      .subscribe({
        next: (res: any) => {
          if (res) {
            const blob = new Blob([res as Blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${Date.now()}-${filters.category}.csv`; // set the file name as needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        },
        error: () => {
          // this.toastr.error(err);
        },
        complete: () => {
          //
        },
      });
  }
  downloadPng(fileName: any, type: any) {
    this.apiService.pngDownloadData$.next({
      status: true,
      filename: fileName,
      type: type,
    });
  }
}
