import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { Activity } from '@shared/interface/activity'; // Update the path accordingly

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  allData: any;
  bannerImages: any;
  pastUniqueActivities: any;
  uniqueActivity: Activity[] = [];
  partnersLogoLocation: any;
  testimonialData: any;
  voiceOfChange: any;
  leadersData: any;
  locationArray: any[] = [];
  themeArray: any[] = [];
  modeArray: any[] = [];
  tags: string[] = ['Locations', 'Modes', 'Themes'];
  activityIdArray: any[] = [];
  tagArray: any[] = [];
  searchCriteria: string;
  numberOfVolunteers: any;
  noOfUniqueVolunteers: any;
  totalHoursVolunteering: any;
  totalNoOfActivities: any;
  enrolledVsParticipated: any;
  currentAudioIndex: number;
  displayCount: number = 6;


  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.isLanding.next(false);

    const fetchUrl = `${LandingPageAPI.getLandingPageDetailsUrl()}`;
    this.apiService.get(fetchUrl).subscribe((val) => {
      this.bannerImages = val.data.banner;
      this.partnersLogoLocation = val.data.partners;
      this.testimonialData = val.data.testimonial;
      this.leadersData = val.data.leadersTalk;
      this.voiceOfChange = val.data.voiceOfChange;
    });

    const actfetchUrl = `${LandingPageAPI.getUniqueActivity()}`;
    this.apiService.get(actfetchUrl).subscribe((val) => {
      this.pastUniqueActivities = val.data;
      this.getActivtyDetails(val.data);
    });

    this.getCardDetails();
  }
  //OnInitEnd

  getCardDetails() {
    //To get card Details.
    for (let tag of this.tags) {
      const params = new HttpParams().set('category', tag);
      const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
      let data: any;
      this.apiService.get(fetchUrl).subscribe((val) => {
        data = val.lovResponses;
        if (tag === 'Locations') {
          for (let lovResponse of data) {
            this.locationArray.push(lovResponse.lovValue);
          }
        } else if (tag === 'Themes') {
          for (let lovResponse of data) {
            this.themeArray.push(lovResponse.lovValue);
          }
        } else if (tag === 'Modes') {
          for (let lovResponse of data) {
            this.modeArray.push(lovResponse.lovValue);
          }
        }

        if (
          this.modeArray.length > 0 &&
          this.themeArray.length > 0 &&
          this.locationArray.length > 0
        ) {
          this.getActivityTagsForCriteria();
        }
      });
    }
  }

  getActivityTagsForCriteria() {
    //To get Activities and Tags for Search criteria.
    let concatenatedValues: string = this.locationArray.join(',');
    const params = new HttpParams().set(`location`, concatenatedValues);
    const fetchUrlFor = `${ActivityAPI.activtyNameByTagUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrlFor).subscribe((val) => {
      for (const tag in val.data) {
        const activities = val.data[tag];
        for (let tagAct of activities) {
          this.activityIdArray.push(tagAct.activityId);
        }
      }
      this.tagArray = Object.keys(val.data);
      if (this.tagArray.length > 0 && this.activityIdArray.length > 0) {
        this.createSearchCriteriaAndCall();
      }
    });
  }

  createSearchCriteriaAndCall() {
    //To form the search criteria.
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date(new Date().getFullYear(), 11, 31);
    const startDateString = this.formatDate(startDate);
    const endDateString = this.formatDate(endDate);
    this.searchCriteria = `startDate=${startDateString}:endDate=${endDateString}`;
    let concatenatedMode: string = this.modeArray.join(',');
    let concatenatedlocations: string = this.locationArray.join(',');
    let concatenatedActivity: string = this.activityIdArray.join(',');
    let concatenatedTheme: string = this.themeArray.join(',');
    let concatenatedTag: string = this.tagArray.join(',');
    this.searchCriteria += `:modeOfParticipation=${concatenatedMode}:themeName=${concatenatedTheme}:location=${concatenatedlocations}:tagName=${concatenatedTag}:activityId=${concatenatedActivity}`;
    const params = new HttpParams().set(`searchCriteria`, this.searchCriteria);
    const fetchUrl = `${AdminActivityAPI.dashboardCardsUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe((val) => {
      this.numberOfVolunteers = val.data.noOfVolunteers;
      this.noOfUniqueVolunteers = val.data.noOfUniqueVolunteers;
      this.totalHoursVolunteering = val.data.totalHoursVolunteering;
      this.totalNoOfActivities = val.data.totalNoOfActivities;
      this.enrolledVsParticipated = val.data.enrolledVsParticipated;
    });
  }

  private formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

  isAudioPlaying = false;

  toggleAudio(index: number) {
    console.log('THis is being toggled');

    if (this.currentAudioIndex === index) {
      this.isAudioPlaying = !this.isAudioPlaying;
    } else {
      this.isAudioPlaying = true;
    }

    this.currentAudioIndex = index;
  }
  showMore() {
     this.router.navigate(['/extra-activities']); 
    }

    

  ngOnDestroy(): void {
    this.apiService.isLanding.next(true);
  }
}
