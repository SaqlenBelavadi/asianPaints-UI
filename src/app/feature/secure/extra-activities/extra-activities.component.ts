import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { Activity } from '@shared/interface/activity';

@Component({
  selector: 'app-extra-activities',
  templateUrl: './extra-activities.component.html',
  styleUrls: ['./extra-activities.component.scss']
})
export class ExtraActivitiesComponent implements OnInit {
  pastUniqueActivities: any;
  uniqueActivity: Activity[] = [];
  activityIdArray: any[] = [];


  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.isLanding.next(false);

    const actfetchUrl = `${LandingPageAPI.getUniqueActivity()}`;
    this.apiService.get(actfetchUrl).subscribe((val) => {
      this.pastUniqueActivities = val.data;
      this.getActivtyDetails(val.data);
    });

    
  }
  getActivtyDetails(activities: any) {
    this.pastUniqueActivities;
    for (let activity of activities) {
      let imageUrl: any;
      for (let image of activity.images) {
        if (image.coverPhoto == true) {
          imageUrl = image.imageUrl;
          break;
        }
      }

      const act = {
        image: imageUrl,
        locations: activity.activityLocation,
        themeName: activity.activityName,
        startDate: activity.startDate.split(' ')[0],
        endDate: activity.endDate.split(' ')[0],
        time: activity.timeOfActivity,
      };
      this.uniqueActivity.push(act);
    }
  }
  backToHomepage(){
    this.router.navigate(['']);
  }
  ngOnDestroy(): void {
    this.apiService.isLanding.next(true);
  }
}
