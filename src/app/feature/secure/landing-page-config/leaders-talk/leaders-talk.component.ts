import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeadersTalkCreateComponent } from './leaders-talk-create/leaders-talk-create.component';
import { ApiService } from '@core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../../common/delete-confirmation/delete-confirmation.component';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';

@Component({
  selector: 'app-leaders-talk',
  templateUrl: './leaders-talk.component.html',
  styleUrls: ['./leaders-talk.component.scss'],
})
export class LeadersTalkComponent implements OnInit {
  constructor(private dialog: MatDialog, private apiService: ApiService, private toastr: ToastrService) {}

  @Input() leadersData: any;

  ngOnInit(): void {
    this.apiService.adminSideNavChanged$.subscribe((res) => {
      if (res?.status && res?.type == 'leaders-talks') {
        this.leadersData = res.leadersData;
      }
    });
  }
  createLeadersTalk() {
    const dialogRef = this.dialog.open(LeadersTalkCreateComponent, {
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
        heading: 'Delete Leader?',
        message:'Are you sure you want to delete the Leader?',
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
          const fetchUrl=`${LandingPageAPI.deleteLeadersTalkData()}?imageName=${selectedImage.toString()}`;
          this.apiService.delete({},fetchUrl).subscribe(()=>{
            
                 this.apiService.adminDataChange$.next(true);
                 this.toastr.success('Leader deleted Successfully');
                 });
          }
    });
  }
  deleteLeadersData(image:any){
    this.removeDataFromApi(image);
    
  }
}
