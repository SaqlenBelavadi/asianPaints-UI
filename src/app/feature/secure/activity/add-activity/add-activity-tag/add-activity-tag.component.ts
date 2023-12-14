import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppLoaderService } from '@core/services/app-loader.service';
import { CommunicationService } from '@core/services/communication.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { ToastrService } from 'ngx-toastr';
import { AddActivityComponent } from '../add-activity.component';

@Component({
  selector: 'app-add-activity-tag',
  templateUrl: './add-activity-tag.component.html',
  styleUrls: ['./add-activity-tag.component.scss'],
})
export class AddActivityTagComponent {
  activtiyNameTagControl = new FormControl('', [
    Validators.required,
    this.trimValidator,
  ]);
  isLoading: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<AddActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private communicatinService: CommunicationService,
    private appLoaderService: AppLoaderService,
    private toastr: ToastrService
  ) {
    this.appLoaderService.loaderVisibility$.subscribe((visibility: boolean) => {
      this.isLoading = visibility;
    });
  }

  saveActivityTag() {
    if (this.activtiyNameTagControl.valid) {
      const params = new HttpParams()
        .set('themeName', this.data.data.theme.toString().trim())
        .set('tagName', this.activtiyNameTagControl.value.toString().trim());

      this.communicatinService
        .post(
          `${ActivityAPI.lovUrl()}/?${params.toString().trim()}`,
          {},
          {},
          true
        )
        .subscribe({
          next: (val: any) => {
            if (val) {
              // let message = 'Aactivty tag added.';
              if (!this.isLoading) {
                this.isLoading = true;
                this.toastr.success(val.message);
                this.dialogRef.close({
                  status: true,
                  option: this.activtiyNameTagControl.value.toString(),
                });
              }
            }
          },
          error: (err: any) => {
            if (err.status == 409) {
              this.toastr.error(`Tag already Exists !`);
            } else {
              this.toastr.error(err.error.message || 'Something went wrong !');
            }
          },
          complete: () => {

          },
        });
    }
  }
  close() {
    this.dialogRef.close({ status: false });
  }
  trimValidator(control: FormControl) {
    if (control && control.value && control.value.startsWith(' ')) {
      return {
        trimError: { value: 'Please remove the sapce before the content' },
      };
    }
    if (control && control.value && control.value.endsWith(' ')) {
      return {
        trimError: { value: 'Please remove the sapce after the content' },
      };
    }

    return null;
  }
}
