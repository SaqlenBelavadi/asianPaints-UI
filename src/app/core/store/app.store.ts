import { Injectable } from '@angular/core';
import { DataStoreBase } from '@vslabs/ngx-tiny-store';

@Injectable({
  providedIn: 'root'
})
export class AppStore extends DataStoreBase {

  constructor() {
    super();
  }

  /* Public Shared Values */
  todo = this.manageStoreValue('todo');
}