import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { LandingPageAPI } from '@shared/constants/api-endpoints/landingPage-api.const';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss'],
})
export class VideoUploadComponent implements OnInit, AfterViewInit {
  videos: any;
  videoUrls: any[] = [];
  videoTmbUrls: string[] = [];
  videoUrl: any;
  @ViewChild('swiperContainer') swiperContainer: ElementRef;
  @ViewChild('youtubeframe') videoFrame: ElementRef;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.apiService.isLanding.next(false);

    const fetchUrl = `${LandingPageAPI.getLandingPageDetailsUrl()}`;
    this.apiService.get(fetchUrl).subscribe((val) => {
      this.videos = val.data.video;

      for (let vid of val.data.video) {
        this.videoUrls.push(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            vid.videoURL + '?enablejsapi=1'
          )
        );

        const videoId = this.extractVideoId(vid.videoURL);
        this.videoTmbUrls.push(
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        );
      }
    });
  }
  ngAfterViewInit() {
    const swiperEl = this.swiperContainer.nativeElement;
    swiperEl.addEventListener('click', this.onClick.bind(this));
  }
  onClick(event: CustomEvent) {
    console.log(event);
    if (event.detail && event.detail instanceof Array && event.detail.length) {
      const player = this.videoFrame.nativeElement;
      const contentWindow = player.contentWindow;
      if (contentWindow) {
        contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      }
    }
  }

  private extractVideoId(embedUrl: any): any {
    const regex = /\/embed\/([^?]+)/;
    const match = embedUrl.match(regex);
    return match ? match[1] : '';
  }
  ngOnDestroy(): void {
    this.apiService.isLanding.next(true);
  }
}
