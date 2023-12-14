import { DatePipe } from '@angular/common';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/core/configs';
import { AppInjector } from 'src/app/core/services/app-injector.service';

@Directive()
export abstract class ComponentBase implements OnInit, OnDestroy {

  /* Public Properties */
  destroy$: Subject<boolean> = new Subject<boolean>();

  /* Private Properties */
  private datePipe: DatePipe;

  /* Constructor */
  constructor() {
    this.datePipe = AppInjector.get(DatePipe);
  }

  /* Life Cycle Hooks */
  ngOnInit(): void {
    this.initVariables();
    this.subscribeEvents();
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyBase();
    this.unload();
  }

  /* Protected Methods */
  abstract initVariables(): void;

  abstract subscribeEvents(): void;

  abstract load(): void;

  abstract unload(): void;

  /* Public Methods */
  formatDate(date: Date | string | null): any {
    return this.datePipe.transform(date, AppConfig.dateFormat);
  }

  /* Private Methods */
  private destroyBase(): void {
    this.unSubscribeEvents();
  }

  private unSubscribeEvents(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
