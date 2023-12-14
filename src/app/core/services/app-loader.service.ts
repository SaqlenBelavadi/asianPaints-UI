import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  loaderVisibility$ = new Subject<boolean>();
  loaderText!: string | null;
  loaderFlag = new BehaviorSubject<boolean>(false);
  constructor() { }

  start(text: string | null = 'loading...'): void {
    this.loaderText = text;
    this.loaderVisibility$.next(true);
  }

  stop(): void {
    this.loaderVisibility$.next(false);
  }
}
