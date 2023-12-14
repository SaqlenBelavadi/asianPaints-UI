import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss'],
})
export class PublishedComponent implements OnInit {
  @Input() publishedImages: any;
  @Input() type: any;
  @Input() feedbackItems: any;
  themeNames: any[] = [];
  themeImages: any[] = [];
  constructor() {}

  ngOnInit(): void {
    //
    if (this.publishedImages && Object.keys(this.publishedImages).length > 0) {
      Object.keys(this.publishedImages).map((theme: any) => {
        this.themeNames.push(theme);
      });
    }
    if (this.feedbackItems && Object.keys(this.feedbackItems).length > 0) {
      Object.keys(this.feedbackItems).map((theme: any) => {
        if (
          this.feedbackItems[theme]['published'].activityFeedback.length > 0
        ) {
          this.themeNames.push(theme);
        }
      });
    }
    if (this.themeNames.length > 0) {
      this.themeNames = [...new Set(this.themeNames)];
    }
  }
}
