import {
  Component, OnInit, OnDestroy, Input, Type,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OverlaySidePanelService } from './overlay-side-panel.service';
import { OverlaySidePanelStyle } from './overlay-side-panel-style.enum';
import { FADE_IN_OUT } from '../../animations/fade-in-out.animation';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-overlay-side-panel',
  templateUrl: './overlay-side-panel.component.html',
  styleUrls: ['./overlay-side-panel.component.scss'],
  animations: [FADE_IN_OUT]
})
export class OverlaySidePanelComponent implements OnInit, OnDestroy {

  @ViewChild('content', { read: ViewContainerRef })
  private panelContentRef: ViewContainerRef | undefined;

  @Input()
  public overlayStyle: OverlaySidePanelStyle

  public isPanelVisible: boolean | undefined;

  private _sidePanelServiceSubject$: Subject<void>;

  @Input() overlayData: any;
  constructor(
    private _overlaySidePanelService: OverlaySidePanelService,
    private apiService: ApiService
  ) {
    this._sidePanelServiceSubject$ = new Subject<void>();
    this.overlayStyle = OverlaySidePanelStyle.DIM_DARK;
  }

  ngOnInit(): void {
    this._overlaySidePanelService.onPanelVibilityChange()
      .pipe(takeUntil(this._sidePanelServiceSubject$))
      .subscribe((visible: boolean) => {
        this.isPanelVisible = visible;
      });

    this._overlaySidePanelService.onContentChange()
      .pipe(takeUntil(this._sidePanelServiceSubject$))
      .subscribe((component: Type<any>) => { this._setPanelContent(component) });
  }

  public close(): void {
    this.apiService.sidePanelClose$.next(true);
    this._overlaySidePanelService.close();
  }

  private _setPanelContent(component: Type<any>) {
    this.panelContentRef?.clear();
    this.panelContentRef?.createComponent(component);
  }

  ngOnDestroy() {
    this._sidePanelServiceSubject$.next();
    this._sidePanelServiceSubject$.complete();
  }

}
