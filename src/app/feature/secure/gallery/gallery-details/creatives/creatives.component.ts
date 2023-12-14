import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-creatives',
  templateUrl: './creatives.component.html',
  styleUrls: ['./creatives.component.scss'],
})
export class CreativesComponent implements OnInit {
  @Input() creativeImages: any;
  @Input() type: any;
  tagNames: any[] = [];
  showTagsDetails: boolean = false;
  selectedTag: any;
  constructor() {}

  ngOnInit(): void {
    if (Object.keys(this.creativeImages).length > 0) {
      Object.keys(this.creativeImages).map((tag: any) => {
        this.tagNames.push(tag);
      });
    }
  }
  goToTagDetails(tagName: any) {
    this.selectedTag = tagName;
    this.showTagsDetails = true;
  }
  goback() {
    this.showTagsDetails = !this.showTagsDetails;
  }
}
