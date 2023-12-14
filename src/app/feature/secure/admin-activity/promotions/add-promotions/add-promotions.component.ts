import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { Roles } from '@shared/enums/role.enum';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: ['./add-promotions.component.scss'],
})
export class AddPromotionsComponent implements OnInit, OnDestroy {
  promotionForm: FormGroup;
  minDate: any;
  @ViewChild('fileInput') el: ElementRef;
  imagePath: any = '';
  editFile: boolean = true;
  removeUpload: boolean = false;
  themeArray: any[] = [];
  locationArray: any[] = [];

  /** Activity name search start */
  activityNameArray: any[] = [];

  /** control for the MatSelect filter keyword */
  public activityFilterCtrl: FormControl = new FormControl();

  /** list of activity filtered by search keyword */
  public filteredActivities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** Activity name search end*/
  selectedActivity: any;
  dates: any;
  isEdit: boolean = false;
  editData: any;
  isImageRemoved: boolean = false;
  endMinDate: Date;
  endMaxDate: Date;
  cacheActivity: any;
  defaultLocation: any;
  role: any;
  startMinDate: any;
  isImageUploaded: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService,
    private communicationService: CommunicationService,
    private _overlaySidePanelService: OverlaySidePanelService,
    private storageService: LocalService
  ) {
    this.fetchLov('Themes').then((themes) => {
      this.themeArray = themes as any[];
    });
    this.role = this.storageService.getData('Role');
    if (this.storageService.getData('d-loc')) {
      this.defaultLocation = this.storageService.getData('d-loc') as string;
    }

    this.fetchLov('Locations').then((locations) => {
      this.locationArray = locations as any[];
    });
    if (this.apiService.isPromotionEdit) {
      this.isEdit = true;
      this.editData = this.apiService.promotionEditData;
      this.getAllImageByActivity();
    }
  }

  async ngOnInit() {
    this.promotionForm = this.fb.group({
      startDate: [
        this.isEdit
          ? moment(this.editData.startDate, 'DD/MM/YYYY hh:mm:ss A')
          : null,
        [Validators.required, this.dateRangeValidator],
      ],
      endDate: [
        this.isEdit
          ? moment(this.editData.endDate, 'DD/MM/YYYY hh:mm:ss A')
          : null,
        [Validators.required, this.dateRangeValidator],
      ],
      activityName: [
        this.isEdit ? this.editData.promotionActivity : '',
        [Validators.required],
      ],
      themeName: [
        this.isEdit ? this.editData.promotionTheme : '',
        [Validators.required],
      ],
      location: ['', [Validators.required]],
      file: [
        this.editData ? this.editData.images[0] : '',
        [Validators.required],
      ],
    });
    if (this.defaultLocation) {
      // setting default location;if local admin then disables the field
      if (this.role == Roles.CADMIN) {
        this.promotionForm.controls.location.setValue([this.defaultLocation]);
      } else {
        this.promotionForm.controls.location.setValue([this.defaultLocation]);
        this.promotionForm.controls.location.disable();
      }
    }

    if (this.isEdit) {
      this.promotionForm.controls.location.setValue(
        this.editData.promotionlocation.toString().trim().split(',')
      );
      this.fetchActivityByLocAndTheme();
      let endDate = moment(
        this.editData.activityEndDate,
        'DD/MM/YYYY hh:mm:ss A'
      ).format('YYYY-MM-DD');
      // let startDate = moment(
      //   this.editData.startDate,
      //   'DD/MM/YYYY hh:mm:ss A'
      // ).format('YYYY-MM-DD');
      // this.startMinDate = new Date(startDate);
      this.endMaxDate = new Date(endDate);
      this.promotionForm.controls.startDate.updateValueAndValidity();
      this.promotionForm.controls.startDate.markAsTouched();
      this.promotionForm.controls.endDate.updateValueAndValidity();
      this.promotionForm.controls.endDate.markAsTouched();
    }
    this.startMinDate = new Date();

    this.formControlValueChanges();

    this.apiService.sidePanelClose$.subscribe((status) => {
      if (
        status &&
        this.apiService.currentRouteUrl == '/admin-activity/promotions'
      ) {
        this.promotionForm.reset();
        this.apiService.isPromotionEdit = false;
        this.apiService.promotionEditData = null;
      }
    });
  }
  dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    const from =
      this.promotionForm && this.promotionForm.get('startDate')?.value;
    const to = this.promotionForm && this.promotionForm.get('endDate')?.value;
    if (from && to) {
      if (new Date(from).valueOf() > new Date(to).valueOf()) {
        this.promotionForm.get('startDate')?.setErrors({ dateRange: true });
        this.promotionForm.get('endDate')?.setErrors({ dateRange: true });
        return { dateRange: true };
      } else {
        this.promotionForm.get('startDate')?.setErrors(null);
        this.promotionForm.get('endDate')?.setErrors(null);
      }
    }

    return null;
  };
  formControlValueChanges() {
    this.promotionForm.controls.themeName.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res) => {
        if (res) {
          if (this.promotionForm.controls.location.value) {
            this.fetchActivityByLocAndTheme();
          }
        }
      });

    this.promotionForm.controls.location.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: string | any[]) => {
        if (res && res.length > 0) {
          this.fetchActivityByLocAndTheme();
        } else {
          this.activityNameArray = [];
          this.filteredActivities.next(this.activityNameArray);
          this.promotionForm.controls.activityName.patchValue(null);
        }
      });

    this.promotionForm.controls.startDate.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res) {
          // this.startMinDate = res;
          this.promotionForm.controls.endDate.updateValueAndValidity();
          this.promotionForm.controls.endDate.markAsTouched();
        }
      });
    this.promotionForm.controls.startDate.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res) {
          this.promotionForm.controls.startDate.updateValueAndValidity();
        }
      });

    // listen for search field value changes
    this.activityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterActivities();
      });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  onActivityNameSelection(event: any) {
    this.selectedActivity = this.activityNameArray[event.value];
    if (this.selectedActivity) {
      let endDate = moment(
        this.selectedActivity.endDate,
        'DD/MM/YYYY hh:mm:ss A'
      ).format('YYYY-MM-DD');

      this.endMaxDate = new Date(endDate);

      this.dates = {
        startDate: moment(
          this.promotionForm.controls.startDate.value,
          'DD/MM/YYYY hh:mm:ss A'
        ).format('DD/MM/YYYY hh:mm:ss A'),
        endDate: moment(
          this.selectedActivity.endDate,
          'DD/MM/YYYY hh:mm:ss A'
        ).format('DD/MM/YYYY hh:mm:ss A'),
      };
      if (
        (this.cacheActivity && this.cacheActivity?.activityId) !==
        this.selectedActivity?.activityId
      ) {
        this.promotionForm.controls.endDate.setValue(endDate);
        this.promotionForm.controls.endDate.enable();
        this.cacheActivity = this.selectedActivity;
      }
      this.promotionForm.controls.startDate.updateValueAndValidity();
      this.promotionForm.controls.startDate.markAsTouched();
      this.promotionForm.controls.endDate.updateValueAndValidity();
      this.promotionForm.controls.endDate.markAsTouched();
    }
  }
  async fetchLov(category: string) {
    const params = new HttpParams().set('category', category);
    const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
    return new Promise((resolve, reject) => {
      this.apiService.get(fetchUrl).subscribe({
        next: (val) => {
          resolve(val.lovResponses ?? []);
        },
        error: () => {
          // this.toastr.error(err.message);
          reject('Something went wrong');
        },
        complete: () => {
          //
        },
      });
    }).then((res) => {
      return res;
    });
  }
  fetchActivityByLocAndTheme() {
    const params = new HttpParams()
      .set('themeName', this.promotionForm.controls.themeName.value)
      .set('location', this.promotionForm.controls.location.value);
    const fetchUrl = `${ActivityAPI.activityPromotionListing()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        this.activityNameArray = val.data ?? [];
        if (this.activityNameArray.length == 0) {
          this.toastr.info(
            'No Actitivity is present for the selected locations'
          );
          this.promotionForm.controls.activityName.patchValue(null);
        } else {
          this.promotionForm.controls.activityName.enable();
        }

        // load the initial activity list
        this.filteredActivities.next(this.activityNameArray.slice());

        if (this.isEdit) {
          //
          //   'this.editData.promotionActivity',
          //   this.activityNameArray
          // );
          const findIndex = this.activityNameArray.findIndex(
            (an) =>
              an.activityName.toString().toLowerCase() ==
              this.editData.promotionActivity.toString().toLowerCase()
          );
          this.selectedActivity = this.activityNameArray.find(
            (item) =>
              item.activityName.toLowerCase() ==
              this.editData.promotionActivity.toLowerCase()
          );
          this.promotionForm.controls.activityName.enable();
          this.promotionForm.controls.activityName.patchValue(findIndex);
        }
      },
      error: () => {
        // this.toastr.error(err.message);
      },
      complete: () => {
        //
      },
    });
  }

  protected filterActivities() {
    if (!this.activityNameArray) {
      return;
    }
    // get the search keyword
    let search = this.activityFilterCtrl.value;
    if (!search) {
      this.filteredActivities.next(this.activityNameArray.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the activities
    this.filteredActivities.next(
      this.activityNameArray.filter(
        (act) => act.activityName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onFileSelection(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (this.fileValidator(file)) {
      this.promotionForm.patchValue({
        file: file,
      });
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imagePath = reader.result;
        };
      }
      this.el.nativeElement.value = '';
    }
  }
  filesDropped(event: any) {
    try {
      const file = event.dataTransfer!.files[0];
      if (this.fileValidator(file)) {
        let reader = new FileReader();
        this.promotionForm.patchValue({
          file: file,
        });
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imagePath = reader.result;
        };
        this.el.nativeElement.value = '';
      }
    } catch (err) {}
  }
  formatPictureUploadBody() {
    var formData = new FormData();
    formData.append('images', this.promotionForm.controls.file.value);
    formData.append('imageType', 'PROMOTIONS');
    formData.append('activityName', this.selectedActivity.activityId);
    formData.append('activityTheme', this.selectedActivity.themeName);
    formData.append('activityTag', this.selectedActivity.tagName);
    formData.append('startDate', this.selectedActivity.startDate);
    formData.append('endDate', this.selectedActivity.endDate);
    formData.append('activityLocation', this.selectedActivity.activityLocation);
    formData.append('mode', this.selectedActivity.modeOfParticipation);
    return formData;
  }
  async uploadPictureToApi(formData: FormData) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'undefined',
      }),
    };
    return new Promise((resolve, reject) => {
      if (formData) {
        this.communicationService
          .post(ActivityAPI.uploadImagesUrl(), formData, options, true)
          .subscribe({
            next: () => {
              // this.toastr.success(val.message);
              resolve(true);
            },
            error: () => {
              reject(false);
            },
            complete: () => {},
          });
      } else {
        resolve(false);
      }
    });
  }

  clearImage() {
    if (this.isEdit) {
      this.isImageUploaded = false;
      this.removeImageFromServer(
        this.editData.images[0].imageName,
        this.editData.activityId
      );
      this.promotionForm.controls.file.patchValue('');
      this.imagePath = '';
      this.isImageRemoved = true;
    } else {
      if (this.isImageUploaded) {
        this.removeImageFromServer(
          this.promotionForm.controls.file.value?.name,
          this.selectedActivity.activityId
        );
      }
      this.isImageUploaded = false;
      this.promotionForm.controls.file.patchValue('');
      this.imagePath = '';
      this.isImageRemoved = true;
    }
  }
  removeImageFromServer(imageName: string, activityId: string) {
    let imageType = 'PROMOTIONS';
    let bodyObj = [
      {
        imageName: imageName,
        imageType: imageType,
        activityId: activityId,
        softDelete: false,
      },
    ];
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: bodyObj,
    };
    this.communicationService
      .delete(ActivityAPI.imagesUrl(), options)
      .subscribe((res: any) => {
        if (res) {
          this.toastr.success('Image removed successfully');
        }
      });
  }

  fileValidator(file: any) {
    if (file) {
      const fileSizeLimit = 5 * 1024 * 1024;
      const fileType = file.name.split('.').pop();
      if (file.size > fileSizeLimit) {
        this.toastr.info('Maximum file size is 5Mb');
        this.el.nativeElement.value = '';
        return false;
      }
      if (
        fileType !== 'jpg' &&
        fileType !== 'jpeg' &&
        fileType !== 'png' &&
        fileType !== 'gif' &&
        fileType !== 'svg' &&
        fileType !== 'pjp' &&
        fileType !== 'pjpeg'
      ) {
        this.toastr.warning(
          'Invalid file type. Only JPG,JPEG,PNG,SVG,PJP,PJPEG and GIF are allowed.'
        );
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  async submit() {
    this.promotionForm.markAllAsTouched();
    this.promotionForm.updateValueAndValidity();

    if (this.promotionForm.valid) {
      const body = this.returnPromtionBody();
      if (this.isEdit) {
        Object.assign(body, { promotionId: this.editData.promotionId });
      }
      const postUrl = `${ActivityAPI.addPromotionUrl()}`;
      this.apiService.post(body, postUrl).subscribe(
        (res: any) => {
          if (res) {
            if (this.isImageRemoved || !this.isEdit) {
              this.toastr.success('Activity Promotion added successfully');
            } else {
              this.toastr.success('Activity Promotion updated successfully');
            }

            this.apiService.promotionSidePanelClose$.next(true);
            this._overlaySidePanelService.close();
            this.promotionForm.reset();
            this.promotionForm.reset();
            this.selectedActivity = null;
            this.cacheActivity = null;
            this.apiService.isPromotionEdit = false;
            this.apiService.promotionEditData = null;
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
    } else {
      this.toastr.warning('Please fill the rquired fields');
    }
  }
  uploadPhoto() {
    if (this.selectedActivity) {
      const uploadBody = this.formatPictureUploadBody() as FormData;
      this.uploadPictureToApi(uploadBody).then((res: any) => {
        if (res) {
          this.isImageUploaded = true;
        }
      });
    } else {
      this.toastr.info('Please select any activity before upload image');
    }
  }

  returnPromtionBody() {
    let formattedStartDate = moment(
      this.promotionForm.controls.startDate.value
    ).format('DD/MM/YYYY hh:mm:ss A');
    let formattedEndDate = moment(
      this.promotionForm.controls.endDate.value
    ).format('DD/MM/YYYY hh:mm:ss A');
    this.dates = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    return {
      startDate: this.dates.startDate,
      endDate: this.dates.endDate,
      promotionTheme: this.promotionForm.controls.themeName.value,
      promotionlocations: this.promotionForm.controls.location.value,
      activityId: this.selectedActivity.activityId,
      promotionActivity: this.selectedActivity.activityName,
    };
  }
  getAllImageByActivity() {
    for (var i = 0; i < this.editData.images?.length; i++) {
      const file = this.editData.images[i];
      const url = file.imageUrl;
      this.imagePath = url;
      this.isImageUploaded = true;
    }
  }
  cancel() {
    this.promotionForm.reset();
    this.selectedActivity = null;
    this.cacheActivity = null;
    this.apiService.isPromotionEdit = false;
    this.apiService.promotionEditData = null;
    this._overlaySidePanelService.close();
  }
}
