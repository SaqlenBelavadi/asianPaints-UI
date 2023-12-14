import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTestimonialComponent } from './create-testimonial/create-testimonial.component';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  @Input() testimonialData: any;
  constructor(private dialog: MatDialog,private apiService:ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'voice-of-change') {
        this.testimonialData = res.voiceOfChange;
      }
    });
  }

  createTestimonial() {
    const dialogRef = this.dialog.open(CreateTestimonialComponent, {
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
        heading: 'Delete Testimonial?',
        message:'Are you sure you want to delete the Testimonial?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deleteTestimonialData()}?imageName=${selectedImage.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Testimonial deleted Successfully');
                 });
          }
    });
  }
  deleteTestimonialData(image:any){
    this.removeDataFromApi(image);
    
  }
}
