import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateVoiceOfChangeComponent } from './create-voice-of-change/create-voice-of-change.component';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-voice-of-change',
  templateUrl: './voice-of-change.component.html',
  styleUrls: ['./voice-of-change.component.scss'],
})
export class VoiceOfChangeComponent implements OnInit {
  constructor(private dialog: MatDialog, private apiService: ApiService,private toastr: ToastrService) {}

  @Input() vocData: any;
  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'testimonials') {
        this.vocData = res.testimonialData;
      }
    });
  }
  createVoiceOfChange() {
    const dialogRef = this.dialog.open(CreateVoiceOfChangeComponent, {
      width: '670px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(res=>{
      if(res?.status)
      {
        this.toastr.success(res?.message);
      }
    });
  }
  removeDataFromApi(selectedImage:any){
    const dialogRef=this.dialog.open(DeleteConfirmationComponent,{
      width: '470px',
      data: {
        heading: 'Delete Voice Of Change?',
        message:'Are you sure you want to delete the Voice Of Change?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deleteVoiceOfChangeData()}?imageName=${selectedImage.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Voice Of Change deleted Successfully');
                 });
          }
    });
  }
  deleteVoiceOfChangeData(image:any){
    this.removeDataFromApi(image);
    
  }
}
