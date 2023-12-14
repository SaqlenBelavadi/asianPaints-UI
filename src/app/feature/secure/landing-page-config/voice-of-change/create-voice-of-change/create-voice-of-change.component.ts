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
  selector: 'app-create-voice-of-change',
  templateUrl: './create-voice-of-change.component.html',
  styleUrls: ['./create-voice-of-change.component.scss'],
})
export class CreateVoiceOfChangeComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('voiceInput') voiceInput: any;
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
    'mp3',
    'mp4',
  ];
  testimonialForm: FormGroup | any;
  constructor(
    public dialogRef: MatDialogRef<CreateVoiceOfChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private communicationService: CommunicationService,
    private storageService: LocalService,
    private apiService:ApiService
  ) {}

  ngOnInit(): void {
    this.testimonialForm = this.initializeFromGroup();
  }
  get photosOrVideos() {
    return this.testimonialForm.controls['image'] as FormArray;
  }
  initializeFromGroup() {
    return this.fb.group({
      name: ['', [Validators.required]],
      designation: ['',[Validators.required]],
      comments: ['',[ Validators.required]],
      image: this.fb.array([], [Validators.required]),
      audio: this.fb.array([], [Validators.required]),
    });
  }
  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      format: [data.format],
    });
  }
  get audioFiles(): FormArray {
    return this.testimonialForm.get('audio') as FormArray;
  }
  // We will create multiple form controls inside defined form controls photos.
  createAudioItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      format: [data.format],
    });
  }
  onFileSelection(event: any, type: any) {
    console.log('type', type);

    const files = event.target.files;

    if (files.length > 0) {
      let format = '';
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.fileInputValidation(file, type)) {
          if (file.type.indexOf('image') > -1) {
            format = 'image';
          } else if (file.type.indexOf('audio') > -1) {
            format = 'audio';
          }
          console.log('format', format);

          if (type == 'image') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.photosOrVideos.push(
              this.createItem({
                file,
                url,
              })
            );
            if (files.length - 1 == i) this.fileInput.nativeElement.value = '';
          } else if (type == 'audio') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.audioFiles.push(
              this.createItem({
                file,
                url,
              })
            );
            if (files.length - 1 == i) this.voiceInput.nativeElement.value = '';
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
  fileInputValidation(file: any, type: any) {
    const fileSizeLimit = 5 * 1024 * 1024;
    try {
      if (type == 'image') {
        if (this.photosOrVideos.value.length > this.limit - 1) {
          this.toastr.info('Max allowed files is 1');
          this.fileInput.nativeElement.value = '';
          return false;
        }
      } else if (type == 'audio') {
        if (this.audioFiles.value.length > this.limit - 1) {
          this.toastr.info('Max allowed files is 1');
          this.voiceInput.nativeElement.value = '';
          return false;
        }
      }

      // if (
      //   this.photosOrVideos.value.find((item: any) =>
      //     item.file.name
      //       ? item.file.name.indexOf(file.name) !== -1
      //       : item.file.imageName.indexOf(file.name) !== -1
      //   )
      // ) {
      //   this.toastr.info('Duplicate file name');
      //   this.fileInput.nativeElement.value = '';
      //   return false;
      // }
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
  clearImage(index: number, type: any) {
    try {
      if (type == 'image') {
        this.photosOrVideos.removeAt(index);
      } else if (type == 'audio') {
        this.audioFiles.removeAt(index);
      }
    } catch (err) {}
  }
  filesDropped(evt: any, type: any): void {
    try {
      let format = '';
      if (this.fileInputValidation(evt.dataTransfer!.files, type)) {
        for (let i = 0; i < evt.dataTransfer!.files.length; i++) {
          const file = evt.dataTransfer!.files[i];
          if (file.type.indexOf('image') > -1) {
            format = 'image';
          } else if (file.type.indexOf('video') > -1) {
            format = 'video';
          }
          if (type == 'image') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.photosOrVideos.push(
              this.createItem({
                file,
                url,
              })
            );
            if (evt.dataTransfer!.files.length - 1 == i)
              this.fileInput.nativeElement.value = '';
          } else if (type == 'audio') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.audioFiles.push(
              this.createItem({
                file,
                url,
              })
            );
            if (evt.dataTransfer!.files.length - 1 == i)
              this.voiceInput.nativeElement.value = '';
          }
        }
      }
    } catch (err) {}
  }
  onSave() {
    if (this.testimonialForm.valid) {

    var formData = new FormData();
    for (const [index, image] of this.photosOrVideos.value.entries()) {
      formData.append('imageAndAudio', image.file);
    }
    for (const [index, audio] of this.audioFiles.value.entries()) {
      formData.append('imageAndAudio', audio.file);
    }
    formData.append(
      'speaksType',
      this.testimonialForm.controls.comments.value
    );
    formData.append('personName', this.testimonialForm.controls.name.value);
    formData.append(
      'designationOrInfo',
      this.testimonialForm.controls.designation.value
    );
    this.callSaveToApi(formData).then((res: any) => {
      if (res) {
      }
    });
  }
  else {
      
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
      let msg=''
      if (formData) {
        this.communicationService
          .post(LandingPageAPI.uploadVoiceOfChange(), formData, options, true)
          .subscribe({
            next: (val: any) => {
              msg=val.message
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
}
