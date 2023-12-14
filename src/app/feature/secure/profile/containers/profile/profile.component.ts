import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '@shared/abstracts/component-base';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends ComponentBase implements OnInit {


  constructor() {
    super();
  }

  /* Public Methods */
  initVariables(): void { }

  subscribeEvents(): void { }

  load(): void { }

  unload(): void { }
}
