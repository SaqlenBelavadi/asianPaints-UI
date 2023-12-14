import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leaders-talk-create',
  templateUrl: './leaders-talk-create.component.html',
  styleUrls: ['./leaders-talk-create.component.scss']
})
export class LeadersTalkCreateComponent implements OnInit {

  errorMessage: string = '';

  @ViewChild('fileInput') fileInput: any;
  limit: number = 1;
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
  leadersForm: FormGroup | any;
  constructor(
    public dialogRef: MatDialogRef<LeadersTalkCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private communicationService: CommunicationService,
    private storageService: LocalService,
    private apiService:ApiService
  ) {}

  ngOnInit(): void {
    this.leadersForm = this.initializeFromGroup();
  }
  get photosOrVideos() {
    return this.leadersForm.controls['image'] as FormArray;
  }
  initializeFromGroup() {
    return this.fb.group({
      name: ['', [Validators.required]],
      designation: ['',[Validators.required]],
      comments: ['',[Validators.required]],
      image: this.fb.array([], [Validators.required]),
    });
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
        this.toastr.info('Max allowed files is 1');
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
  onSave() {
    if (this.leadersForm.valid) {
    
      console.log('Form is valid. Proceed with upload.');
      console.log(this.leadersForm.value);
    var formData = new FormData();
    for (const [index, image] of this.photosOrVideos.value.entries()) {
      formData.append('images', image.file);
    }
    formData.append('leaderName', this.leadersForm.controls.name.value);
    formData.append(
      'designation',
      this.leadersForm.controls.designation.value
    );
    formData.append(
      'description',
      this.leadersForm.controls.comments.value
    );
    this.callSaveToApi(formData).then((res: any) => {
      if (res) {
      }
    });
    } else {
      
        this.toastr.info(
          'Please fill all the required fields'
        );
      
    }
    
  }

  callSaveToApi(formData: FormData) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'undefined',
      }),
    };

    return new Promise((resolve, reject) => {
      if (formData) {
        let msg='';
        this.communicationService
          .post(LandingPageAPI.uploadLeadersTalksUrl(), formData, options, true)
          .subscribe({
            next: (val: any) => {
              msg=val.message;
              resolve(val);
            },
            error: (err: { error: { message: string | undefined } }) => {
              
              this.toastr.error(err.error.message);
              reject(err);
            },
            complete: () => {
              this.dialogRef.close({
                status:true,
                type:"add",
                message:msg
              });
              this.apiService.adminDataChange$.next(true);
            }
          });
      } else {
        resolve([]);
      }
    });
  }
  getErrorMessage(controlName: string): string {
    const control = this.leadersForm.get(controlName);

    if (control.hasError('required')) {
      return 'This field is required';
    }
 return '';
  }
 
}
