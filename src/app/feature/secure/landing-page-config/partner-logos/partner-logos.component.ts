import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { PartnersLogoCreateComponent } from './partners-logo-create/partners-logo-create.component';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-partner-logos',
  templateUrl: './partner-logos.component.html',
  styleUrls: ['./partner-logos.component.scss'],
})
export class PartnerLogosComponent implements OnInit {

  @Input() partnersData:any;
  constructor(private dialog: MatDialog,private apiService: ApiService,
    private toastr: ToastrService) { }


  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'partners-logos') {
        this.partnersData = res.partnersLogoLocation;
      }
    });
  }

  createPartnersLogo() {
    const dialogRef = this.dialog.open(PartnersLogoCreateComponent, {
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
        heading: 'Delete Partners Logo?',
        message:'Are you sure you want to delete the Partners Logo?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deletePartnersLogo()}?imageName=${selectedImage.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Partner logo deleted Successfully');
                 });
          }
    });
  }
  deletePartnersLogo(image:any){
    this.removeDataFromApi(image);
    
  }
}
