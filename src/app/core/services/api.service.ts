import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from './app-loader.service';
import { CommunicationService } from './communication.service';
import { Observable, Subject, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoading: boolean = true;

  isActivityEdit: boolean = false;

  ativityEditData: any;

  public switchProfile$ = new Subject<any>();

  public sidePanelClose$ = new Subject<any>();

  public sidePanelMatClose$ = new Subject<any>();

  public sidePanelDialogData$ = new Subject<any>();

  public feedbackEditFromGallery$ = new Subject<any>();

  public activityEditFromList$ = new Subject<any>();

  public activityConfrimParticipationList$ = new Subject<any>();

  public currentRouteUrl: any;
  public previousRouteUrl: any;

  public promotionSidePanelClose$ = new Subject<any>();

  public isLanding: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isPromotionEdit: boolean = false;

  promotionEditData: any;
  createdActivity: any;

  feedbackAddData: any; // used for passing feedback related to create form from activity detail screen
  isfeedbackEdit: any; // used for passing feedback related to create form from activity detail screen
  feedbackPanelClose$ = new Subject<any>();
  isPastActivityEdit: boolean = false;

  isOngoingActivityEdit: boolean = false;

  public viewBreadCrumb$ = new Subject<any>();

  public pngDownloadData$ = new Subject<any>();

  public adminSideNavChanged$ = new Subject<any>();

  public adminDataChange$ = new Subject<any>();


  constructor(
    private communicationService: CommunicationService,
    private toastr: ToastrService,
    private appLoaderService: AppLoaderService,
    private http: HttpClient
  ) {
    this.appLoaderService.loaderVisibility$.subscribe((visibility: boolean) => {
      this.isLoading = visibility;
    });
  }

  get(url: any): Observable<any> {
    return this.communicationService
      .get<any>(url, {}, true)
      .pipe(map((response) => response));
  }
  
  post(data: any, url: any): Observable<String> {
    return this.communicationService
      .post<any>(url, data, true)
      .pipe(map((response) => response));
  }

  update(data: any, url: any): Observable<String> {
    return this.communicationService
      .put<any>(url, data, { responseType: 'text' }, true)
      .pipe(map((response) => response));
  }

  subscribeHandler(isEdit: any, type: any, dialogRef: any) {
    return {
      next: (val: any) => {
        if (val) {
          let message = isEdit ? `${type} Updated` : `${type} Created`;
          if (!this.isLoading) this.toastr.success(message);
          dialogRef.close(true);
        }
      },
      error: (err: any) => {
        if (err.status == 409) {
          this.toastr.error(`${type} already Exists !`);
        } else {
          this.toastr.error(err);
        }
      },
      complete: () => {},
    };
  }

  isProfileSwitched() {
    return this.switchProfile$.asObservable();
  }

  switchProfiles() {
    this.switchProfile$.next(true);
  }

  delete(data: any, url: any): Observable<String> {
    return this.communicationService
      .delete<any>(url, { body: data }, true)
      .pipe(map((response) => response));
  }
  downloadFile(url: string, fileName: string) {
    return this.http
      .get(url, { responseType: 'blob' })
      .subscribe((response: any) => {
        const file = new Blob([response], { type: response.type });
        saveAs(file, fileName);
      });
  }
}
