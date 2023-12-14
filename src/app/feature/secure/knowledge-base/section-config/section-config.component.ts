import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-section-config',
  templateUrl: './section-config.component.html',
  styleUrls: ['./section-config.component.scss']
})
export class SectionConfigComponent implements OnInit {

  hideBottom = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.hideBottom = this.data.section
  }

  showandHide(){
    this.hideBottom = !this.hideBottom
  }

}
