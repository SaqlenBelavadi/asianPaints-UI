import { environment } from 'src/environments/environment';

export const AdminActivityAPI = {
  getAdminUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Admins`;
  },
  getEmpDetailsByIdUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Employees`;
  },
  downloadCsvUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/downloadCSV`;
  },
  dashboardDetailsUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/DashBoard/DashBoardDetails`;
  },
  dashboardCardsUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/DashBoard/Header`;
  },
  dashboardPastActivityUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/DashBoard/PastActivity`;
  },
  dashboardCsvDownloadUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/downloadCSV/DashBoard`;
  },
};
