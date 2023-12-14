import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-yt-videos-create',
  templateUrl: './yt-videos-create.component.html',
  styleUrls: ['./yt-videos-create.component.scss']
})
export class YtVideosCreateComponent implements OnInit {

  // videoForm: FormGroup | any;
  // dialogRef: any;
  constructor( public dialogRef: MatDialogRef<YtVideosCreateComponent>,
    private communicationService:CommunicationService,
                  private toastr: ToastrService,
                    private apiService:ApiService,private fb:FormBuilder) { }

  ngOnInit(): void {
    // this.videoForm = this.fb.group({
    //   videoURL:['',Validators.required];
    // });
  }

  url:string;
  onSave(){
    if(this.validateURL(this.url))
    {
      const formData=new FormData();
      formData.append('videoURL',this.url);
      formData.append('videoName','Asian Paints');
      this.callSaveToApi(formData).then((res: any) => {
        if (res) {
        }
      });
    }else{
      this.toastr.error("Please Enter Embed Url Link only");
    }
  }

  validateURL(url:string):boolean{
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    if(pattern.test(url))
    {
      return true;
    }else{
      return false;
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
            .post(LandingPageAPI.uploadVideo(), form, options, true)
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
