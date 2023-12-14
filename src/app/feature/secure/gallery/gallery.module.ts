import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { SharedModule } from '@shared/shared.module';
import { GalleryByThemewiseComponent } from './gallery-by-themewise/gallery-by-themewise.component';
import { PublishedComponent } from './gallery-details/published/published.component';
import { UnpublishedComponent } from './gallery-details/unpublished/unpublished.component';
import { CreativesComponent } from './gallery-details/creatives/creatives.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { CreativeDetailsComponent } from './gallery-details/creatives/creative-details/creative-details.component';
import { FeedbackByThemewiseComponent } from './feedback-by-themewise/feedback-by-themewise.component';
import { StarRatingModule } from '@shared/components/star-rating/star-rating.module';
import { OverlaySidePanelModule } from '@shared/components/overlay-side-panel/overlay-side-panel.module';

@NgModule({
  declarations: [
    GalleryDetailsComponent,
    GalleryByThemewiseComponent,
    PublishedComponent,
    UnpublishedComponent,
    CreativesComponent,
    CreativeDetailsComponent,
    FeedbackByThemewiseComponent,
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SharedModule,
    PaginationModule,
    StarRatingModule,
    OverlaySidePanelModule,
  ],
})
export class GalleryModule {}
