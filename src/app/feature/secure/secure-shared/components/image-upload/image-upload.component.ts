import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from '@core/services/communication.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { LocalService } from '@core/services/local-storage.service';
import { Roles } from '@shared/enums';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @ViewChild('fileInput') fileInput: any;

  uploadForm = this.fb.group({
    images: this.fb.array([], [Validators.required]),
  });
  limit: number = 5;
  allowedFileExtensions = [
    'jpg',
    'svg',
    'jpeg',
    'png',
    'gif',
    'jfif',
    'pjpeg',
    'pjp',
  ];
  role: any;
  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private communicationService: CommunicationService,
    private storageService: LocalService
  ) {
    //
    this.role = this.storageService.getData('Role');
  }
  public get roleEnum() {
    return Roles;
  }

  get photosOrVideos() {
    return this.uploadForm.controls['images'] as FormArray;
  }
  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
    });
  }
  onFileSelection(event: any) {
    const files = event.target.files;

    if (files.length > 0) {
      let balance = 5 - this.data?.pagedItems.length;
      if (this.role === this.roleEnum.EMPLOYEE && files.length > balance) {
        this.toastr.info(
          `Sorry you have uploaded ${this.data?.pagedItems.length} images.${
            balance < 0 || balance == 0 ? '' : `You can upload ${balance} more`
          }`
        );
        this.fileInput.nativeElement.value = '';
        return false;
      }
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
            })
          );
        }

        if (files.length - 1 == i) this.fileInput.nativeElement.value = '';
      }
      return true;
    } else {
      return false;
    }
  }
  fileInputValidation(file: any) {
    const fileSizeLimit = 5 * 1024 * 1024;
    try {
      if (this.photosOrVideos.value.length > this.limit - 1) {
        this.toastr.info('Max allowed files is 5');
        this.fileInput.nativeElement.value = '';
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
      if (file.size > fileSizeLimit) {
        this.toastr.info('Maximum allowed file size is 5mb');
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
  clearImage(index: number) {
    try {
      this.photosOrVideos.removeAt(index);
    } catch (err) {}
  }
  filesDropped(evt: any): void {
    try {
      if (this.fileInputValidation(evt.dataTransfer!.files)) {
        for (let i = 0; i < evt.dataTransfer!.files.length; i++) {
          const file = evt.dataTransfer!.files[i];
          const url = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          );
          this.photosOrVideos.push(
            this.createItem({
              file,
              url,
            })
          );
        }
      }
    } catch (err) {}
  }
  uploadPictureOrVideos() {
    try {
      var formData = new FormData();
      for (const image of this.photosOrVideos.value) {
        if (!image.file.imageName) {
          formData.append('images', image.file);
        }
      }
      formData.append('imageType', 'EMPLOYEE_UPLOAD');
      formData.append('activityName', this.data.activityName);
      formData.append('activityTheme', this.data.activityTheme);
      formData.append('activityTag', this.data.activityTag);
      let start = moment(this.data.startDate, 'DD/MM/YYYY hh:mm:ss A')
        .set({ second: 0 })
        .format('DD/MM/YYYY hh:mm:ss A');
      let end = moment(this.data.endDate, 'DD/MM/YYYY hh:mm:ss A')
        .set({ second: 0 })
        .format('DD/MM/YYYY hh:mm:ss A');
      formData.append('startDate', start);
      formData.append('endDate', end);
      formData.append('activityLocation', this.data.activityLocation);
      formData.append('mode', this.data.mode);
      formData.append(
        'manualUpload',
        this.role === this.roleEnum.EMPLOYEE ? 'false' : 'true'
      );
      this.uploadImages(formData).then((res: any) => {
        if (res) {
          this.dialogRef.close(true);
        }
      });
    } catch (err) {}
  }

  uploadImages(formData: FormData) {
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
              resolve(val);
            },
            error: (err) => {
              this.toastr.error(err.error.message);
              reject(err);
            },
            complete: () => {},
          });
      } else {
        resolve([]);
      }
    });
  }
}
