import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  showKnowledge = false;
  closeNotification = false;
  constructor() { }
}
