import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { ToastrService } from 'ngx-toastr';
import { CreateTestimonialComponent } from '../../testimonials/create-testimonial/create-testimonial.component';

@Component({
  selector: 'app-partners-logo-create',
  templateUrl: './partners-logo-create.component.html',
  styleUrls: ['./partners-logo-create.component.scss']
})
export class PartnersLogoCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
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

  constructor(
    public dialogRef: MatDialogRef<PartnersLogoCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private communicationService: CommunicationService,
    private apiService:ApiService
  ) { }

  ngOnInit(): void {
    this.bannerPictureForm=this.initializeFromGroup()
  }

  bannerPictureForm: FormGroup | any;
  
  initializeFromGroup() {
    return this.fb.group({
      image: this.fb.array([], [Validators.required]),
    });
  }

  get photos() {
    return this.bannerPictureForm.controls['image'] as FormArray;
  }

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
          const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
          this.photos.push(
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
      if (this.photos.value.length > this.limit - 1) {
        this.toastr.info('Max allowed files is 5');
        this.fileInput.nativeElement.value = '';
        return false;
      }
      if (
        this.photos.value.find((item: any) =>
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
      this.photos.removeAt(index);
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
          this.photos.push(
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
    if (this.bannerPictureForm.valid) {

    console.log(this.bannerPictureForm.value);
    console.log(this.photos.value.entries)
    const formData=new FormData();
    
    for(const [index,image] of this.photos.value.entries())
    {
      formData.append('images', image.file)
    }

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

  callSaveToApi(form:FormData)
  {
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'undefined',
      }),
    };

      return new Promise((resolve, reject) => {
        if (form) {
          let msg='';
          this.communicationService
            .post(LandingPageAPI.uploadLogoPartner(), form, options, true)
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
              },
            });
        } else {
          resolve([]);
        }
      });
      
  }
}
