import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CreateBannerComponent } from './create-banner/create-banner.component';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  @Input() bannerData: any;

  constructor(private apiService: ApiService, private dialog: MatDialog,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'bannersImage') {
        this.bannerData = res.bannerImages;
      }
    });
  }

  createBanner() {
    const dialogRef = this.dialog.open(CreateBannerComponent, {
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
  removeImagesFromApi(selectedImage:any){
    const dialogRef=this.dialog.open(DeleteConfirmationComponent,{
      width: '470px',
      data: {
        heading: 'Delete Image?',
        message:'Are you sure you want to delete the image?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deleteBannerImages()}?imageName=${selectedImage.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Image deleted Successfully');
                 });
          }
    });
  }
  deleteBanner(image:any){
    this.removeImagesFromApi(image);
    
  }
}
