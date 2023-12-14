import { Component, OnInit } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { AppLoaderService } from '@core/services/app-loader.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { Activity } from '@shared/interface/activity';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  currentRoute: string = '';
  bannerImages: any;
  partnersLogoLocation: any;
  testimonialData: any;
  voiceOfChange: any;
  leadersData: any;
  video: any;
  isMenuCollapse = false;
  isLoading: boolean = true;
  constructor(
    private apiService: ApiService,
    private appLoaderService: AppLoaderService
  ) {
    let data = {
      status: true,
      label: '',
      activityName: '',
    };
    this.apiService.viewBreadCrumb$.next(data);
    this.setRoute('bannersImage'); //initially setting to list banners image
    this.appLoaderService.loaderVisibility$.subscribe((visibility: boolean) => {
      this.isLoading = visibility;
    });
  }

  ngOnInit(): void {
    this.getData();
    this.apiService.adminDataChange$.subscribe(res=>{
      if(res)
      {
        this.getData();
      }
    })
  }

  getData() {
    const fetchUrl = `${LandingPageAPI.getLandingPageDetailsUrl()}`;
    this.apiService.get(fetchUrl).subscribe((val) => {
      this.bannerImages = val.data.banner;
      this.partnersLogoLocation = val.data.partners;
      this.testimonialData = val.data.testimonial;
      this.leadersData = val.data.leadersTalk;
      this.voiceOfChange = val.data.voiceOfChange;
        for(let entry of val.data.video){
          const videoId = this.extractVideoId(entry.videoURL);
          entry.videoImage= `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`  
        }
      this.video = val.data.video;
      this.apiService.adminSideNavChanged$.next({
        status: true,
        type: this.currentRoute,
        bannerImages: this.bannerImages,
        partnersLogoLocation: this.partnersLogoLocation,
        testimonialData: this.testimonialData,
        leadersData: this.leadersData,
        voiceOfChange: this.voiceOfChange,
        video: this.video,
      });
    });
  }

  
  extractVideoId(embedUrl: any): any {
    const regex = /\/embed\/([^?]+)/;
    const match = embedUrl.match(regex);
    return match ? match[1] : '';
  }


  setRoute(route: string): void {
    this.currentRoute = route;
    this.getData();
  }
  onMenuClick() {
    this.isMenuCollapse = !this.isMenuCollapse;
  }
}
