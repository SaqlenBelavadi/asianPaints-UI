import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-unpublished',
  templateUrl: './unpublished.component.html',
  styleUrls: ['./unpublished.component.scss'],
})
export class UnpublishedComponent implements OnInit {
  @Input() unpublishedImages: any;
  @Input() type: any;
  @Input() feedbackItems: any;
  themeNames: any[] = [];
  themeImages: any[] = [];
  constructor() {}

  ngOnInit(): void {
    if (
      this.unpublishedImages &&
      Object.keys(this.unpublishedImages).length > 0
    ) {
      Object.keys(this.unpublishedImages).map((theme: any) => {
        this.themeNames.push(theme);
      });
    }
    if (this.feedbackItems && Object.keys(this.feedbackItems).length > 0) {
      Object.keys(this.feedbackItems).map((theme: any) => {
        if (
          this.feedbackItems[theme]['unPublished'].activityFeedback.length > 0
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
