import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { YtVideosCreateComponent } from './yt-videos-create/yt-videos-create.component';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-youtube-videos',
  templateUrl: './youtube-videos.component.html',
  styleUrls: ['./youtube-videos.component.scss'],
})
export class YoutubeVideosComponent implements OnInit {
  @Input() ytData: any;

  constructor(private apiService: ApiService,private dialog: MatDialog,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'youtube-video') {
        this.ytData = res.video;
      }
    });
  }
  createVideo()
  {
    const dialogRef = this.dialog.open(YtVideosCreateComponent, {
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
  removeVideoFromApi(selectedVideo:any){
    const dialogRef=this.dialog.open(DeleteConfirmationComponent,{
      width: '470px',
      data: {
        heading: 'Delete Video?',
        message:'Are you sure you want to delete the Video?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deleteVideo()}?videoURL=${selectedVideo.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Video deleted Successfully');
                 });
          }
    });
  }
  deleteVideo(videoURL:any){
    this.removeVideoFromApi(videoURL);
    
  }
}
