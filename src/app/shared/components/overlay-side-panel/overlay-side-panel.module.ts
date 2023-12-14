import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlaySidePanelComponent } from './overlay-side-panel.component';
import { OverlaySidePanelService } from './overlay-side-panel.service';


@NgModule({
  declarations: [
    OverlaySidePanelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OverlaySidePanelComponent
  ],
  providers: [
    OverlaySidePanelService
  ]
})
export class OverlaySidePanelModule { }
