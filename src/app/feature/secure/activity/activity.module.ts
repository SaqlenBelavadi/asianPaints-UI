import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ActivitiesComponent } from './activities/activities.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { OverlaySidePanelModule } from '@shared/components/overlay-side-panel/overlay-side-panel.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { AddActivityTagComponent } from './add-activity/add-activity-tag/add-activity-tag.component';
import { AddFeedbackComponent } from './add-feedback/add-feedback.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ActivitiesByTabComponent } from './activities/activities-by-tab/activities-by-tab.component';
import { FeedbackReadMoreComponent } from './activity-details/feedback-read-more/feedback-read-more.component';
import { StarRatingModule } from '@shared/components/star-rating/star-rating.module';
import { MyHistoryComponent } from './my-history/my-history.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ConfirmParticipationSuccessComponent } from './confirm-participation-success/confirm-participation-success.component';

@NgModule({
  declarations: [
    ActivitiesComponent,
    AddActivityComponent,
    ActivityDetailsComponent,
    AddActivityTagComponent,
    AddFeedbackComponent,
    ActivitiesByTabComponent,
    FeedbackReadMoreComponent,
    MyHistoryComponent,
    ConfirmParticipationSuccessComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ActivityRoutingModule,
    OverlaySidePanelModule,
    EditorModule,
    PaginationModule,
    StarRatingModule,
    ScrollingModule
  ],
  providers: [],
  entryComponents: [AddActivityComponent],
})
export class ActivityModule {}
