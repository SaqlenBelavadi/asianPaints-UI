import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/services/api.service';
import { AppLoaderService } from '@core/services/app-loader.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { Roles } from '@shared/enums';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss'],
})
export class AddFeedbackComponent implements OnInit, OnDestroy {
  disableUploadImgbtn: boolean = false;
  allowedFileExtensions = [
    'jpg',
    'svg',
    'jpeg',
    'png',
    'wav',
    'mp3',
    'mp4',
    'gif',
    'mov',
    'avi',
  ];
  limit = 5;
  @ViewChild('fileInput') fileInput: any;
  feedbackForm: FormGroup | any;
  activityDetails: any;
  editData: any;
  isEdit: boolean = false;
  uplodedImages: any[] = [];
  isImageUploaded: boolean = false;
  sidePanelCloseSubscription: Subscription;
  disableBtn: boolean = false;
  role: string;
  constructor(
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private communicationService: CommunicationService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private _overlaySidePanelService: OverlaySidePanelService,
    private storageService: LocalService,
    private dialog: MatDialog,
    private loaderService: AppLoaderService
  ) {
    this.role = this.storageService.getData('Role');
  }

  ngOnInit(): void {
    this.activityDetails = this.apiService.feedbackAddData;
    //
    if (this.apiService.isfeedbackEdit) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.feedbackForm = this.initializeFromGroup();
    if (this.isEdit) {
      this.getImagesOrVideos(this.activityDetails.images);
    }
    this.sidePanelCloseSubscription = this.apiService.sidePanelClose$.subscribe(
      (status) => {
        if (
          status &&
          this.apiService.currentRouteUrl.includes('/activity/activity-detail')
        ) {
          this.apiService.isfeedbackEdit = false;
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.sidePanelCloseSubscription) {
      this.sidePanelCloseSubscription.unsubscribe();
    }
  }
  public get roleEnum(): typeof Roles {
    return Roles;
  }
  submitFeedback() {
    this.feedbackForm.markAllAsTouched();
    this.disableBtn = true;
    //
    const subIfo = JSON.parse(this.storageService.getData('sub-info'));
    let time = this.activityDetails.timeRequired
      .toString()
      .trim()
      .split('Hours');
    let minute = this.activityDetails.timeRequired
      .split('minutes')
      .filter(Boolean)
      .toString()
      .split('Hours')
      .pop();
    let requiredTime = `${time[0].trim()} Hours ${minute.trim()} minutes`;
    this.activityDetails.timeRequired = requiredTime;
    if (this.isEdit) {
      this.photosOrVideos.value.map((item: any) => {
        if (item.file.imageName) {
          this.uplodedImages.push(item.file.imageName);
        }
      });
    }
    if (this.uplodedImages.length == 0) {
      this.toastr.info('Please upload image before create feedback');
      return;
    }

    if (this.feedbackForm.valid && this.uplodedImages.length > 0) {
      const url = `${ActivityAPI.activityDetailsFeedbackUrl()}`;
      delete this.activityDetails.images;
      delete this.activityDetails.employeeIds;
      delete this.activityDetails.fullName;
      delete this.activityDetails.createdDate;
      delete this.activityDetails.publishOrUnPublish;
      delete this.activityDetails.uploadedByAdmin;

      const bodyObj = {
        ...this.activityDetails,
        employeeId: subIfo.employeecode,
        feedback: this.feedbackForm.controls.feedback.value,
        rating: this.feedbackForm.controls.rating.value,
        imageNames: this.uplodedImages,
        manualUpload: this.role === this.roleEnum.EMPLOYEE ? false : true,
      };
      if (this.isEdit) {
        bodyObj.feedbackId = this.activityDetails.feedbackId;
      }
      this.apiService.post(bodyObj, url).subscribe(
        (res) => {
          if (res) {
            if (!this.isEdit) {
              this._overlaySidePanelService.close();
              this.apiService.feedbackPanelClose$.next({
                status: true,
                type: 'Add',
              });
              // this.dialog.open(ConfirmParticipationSuccessComponent);
            } else {
              this._overlaySidePanelService.close();
              this.apiService.feedbackPanelClose$.next({
                status: true,
                type: 'Edit',
              });
            }
          }
        },
        (err) => {
          this.disableBtn = false;
          // this._overlaySidePanelService.close();
          // this.apiService.feedbackPanelClose$.next(true);
          this.toastr.error(err?.error?.message ? err?.error?.message : '');
        }
      );
    } else {
      this.disableBtn = false;
      if (this.uplodedImages.length == 0) {
        this.toastr.info('Please upload image before create feedback');
      } else {
        this.toastr.warning('Please fill the required fields');
      }
    }
  }
  get photosOrVideos(): FormArray {
    //
    return this.feedbackForm.get('images') as FormArray;
  }

  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      isUploaded: [data.uploaded],
    });
  }
  initializeFromGroup() {
    return this.fb.group({
      rating: [
        this.isEdit ? this.activityDetails.rating : null,
        [Validators.required],
      ],
      feedback: [this.isEdit ? this.activityDetails.feedback : ''],
      images: this.fb.array([], [Validators.required]),
    });
  }

  filesDropped(evt: any) {
    if (evt.dataTransfer!.files.length) {
      for (let i = 0; i < evt.dataTransfer!.files.length; i++) {
        const file = evt.dataTransfer!.files[i];
        if (this.fileInputValidation(file)) {
          this.disableUploadImgbtn = false;
          const url = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          );
          this.photosOrVideos.push(
            this.createItem({
              file,
              url,
              uploaded: false,
            })
          );
        }

        if (evt.dataTransfer!.files.length - 1 == i) {
          this.fileInput.nativeElement.value = '';
          this.isImageUploaded = false;
          return true;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  clearImage(index: number) {
    try {
      this.disableUploadImgbtn = false;
      let itemToDelete = this.photosOrVideos.value[index];
      //
      if (
        (itemToDelete.file.imageName || itemToDelete.file.name) &&
        itemToDelete.isUploaded
      ) {
        this.removeImageFromServer(itemToDelete.file, 'normal');
      }
      this.photosOrVideos.removeAt(index);
      if (
        this.photosOrVideos.value.length > 0 &&
        this.photosOrVideos.value.every((item: any) => item.isUploaded)
      ) {
        this.isImageUploaded = true;
      } else {
        if (this.photosOrVideos.value.length == 0) {
          this.isImageUploaded = false;
          this.disableUploadImgbtn = true;
        } else {
          this.isImageUploaded = false;
        }
      }
    } catch (err) {}
  }

  removeImageFromServer(file: any, type: any) {
    //
    let imageType = 'EMPLOYEE_UPLOAD';
    let bodyObj = [
      {
        imageName: file.name ? file.name : file.imageName,
        imageType: imageType,
        activityId: this.activityDetails.activityId,
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
      .subscribe((res) => {
        if (res) {
          type == 'normal'
            ? this.toastr.success('Image removed successfully')
            : '';
        }
      });
  }

  fileInputValidation(file: any) {
    const fileSizeLimit = 5 * 1024 * 1024;
    try {
      if (this.photosOrVideos.value.length > this.limit - 1) {
        this.toastr.info('Max allowed no of files is 5');
        this.fileInput.nativeElement.value = '';
        return false;
      }
      if (file.size > fileSizeLimit) {
        this.toastr.info('Maximum allowed file size is 5mb');
        return false;
      }
      if (
        this.photosOrVideos.value.find((item: any) =>
          item.file.name
            ? item.file.name.indexOf(file.name) !== -1
            : item.file.imageName.indexOf(file.name) !== -1
        )
      ) {
        this.toastr.info('Duplicate file name');
        this.fileInput.nativeElement.value = '';
        return false;
      }
      return this.validateImageOrVideoExtensions(file);
    } catch (err) {}
    return true;
  }

  validateImageOrVideoExtensions(file: any) {
    try {
      var oInput = file;
      var sFileName = oInput.name;
      if (sFileName.length > 0) {
        var blnValid = false;
        for (var j = 0; j < this.allowedFileExtensions.length; j++) {
          var sCurExtension = this.allowedFileExtensions[j];
          if (
            sFileName.substr(sFileName.lastIndexOf('.') + 1).toLowerCase() ==
            sCurExtension.toLowerCase()
          ) {
            blnValid = true;
            break;
          }
        }
        if (!blnValid) {
          this.toastr.warning(
            'Sorry, ' +
              sFileName +
              ' is invalid, allowed extensions are: ' +
              this.allowedFileExtensions.join(', ')
          );
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {}

    return true;
  }

  uploadPictureOrVideos() {
    try {
      //
      var formData = new FormData();
      this.disableUploadImgbtn = true;
      for (const [index, image] of this.photosOrVideos.value.entries()) {
        if (!image.file.imageName && !image.isUploaded) {
          formData.append('images', image.file);
          this.photosOrVideos
            .at(index)
            .patchValue({ ...image, isUploaded: true });
        }
      }
      formData.append('imageType', 'EMPLOYEE_UPLOAD');
      formData.append('activityName', this.activityDetails.activityId);
      formData.append('activityTheme', this.activityDetails.themeName);
      formData.append('activityTag', this.activityDetails.tagName);
      formData.append('startDate', this.activityDetails.startDate);
      formData.append('endDate', this.activityDetails.endDate);
      formData.append('activityLocation', this.activityDetails.location);
      formData.append('mode', this.activityDetails.mode);
      formData.append(
        'manualUpload',
        this.role === this.roleEnum.EMPLOYEE ? 'false' : 'true'
      );
      this.uploadImages(formData).then((res: any) => {
        if (res) {
          //
        }
      });
    } catch (err) {}
  }

  uploadImages(formData: FormData) {
    this.uplodedImages = [];
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
            next: (val: any) => {
              this.toastr.success(val.message);
              this.uplodedImages = val.data;
              this.isImageUploaded = true;

              resolve(val);
            },
            error: (err) => {
              this.disableUploadImgbtn = false;
              this.toastr.error(err.error.message);
              this.isImageUploaded = false;

              reject(err);
            },
            complete: () => {},
          });
      } else {
        resolve([]);
      }
    });
  }

  onFileSelection(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.disableUploadImgbtn = false;
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.fileInputValidation(file)) {
          const url = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          );
          this.photosOrVideos.push(
            this.createItem({
              file,
              url,
              uploaded: false,
            })
          );
        }
        if (files.length - 1 == i) {
          this.fileInput.nativeElement.value = '';
          this.isImageUploaded = false;
          return true;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  getImagesOrVideos(files: any) {
    //
    this.disableUploadImgbtn = true;
    if (files && files.length) {
      this.isImageUploaded = true;
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const url = file.imageUrl;
        this.photosOrVideos.push(
          this.createItem({ file, url, uploaded: true })
        );
      }
    }
  }
  onCancelClick() {
    if (this.photosOrVideos.value.length > 0 && this.isImageUploaded) {
      this.loaderService.start();
      for (const [index, image] of this.photosOrVideos.value.entries()) {
        this.removeImageFromServer(image.file, 'cancel');
        if (this.photosOrVideos.value.length - 1 == index) {
          this.apiService.isfeedbackEdit = false;
          this._overlaySidePanelService.close();
          this.loaderService.stop();
        }
      }
    } else {
      this.apiService.isfeedbackEdit = false;
      this._overlaySidePanelService.close();
    }
  }
}
