import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryByThemewiseComponent } from './gallery-by-themewise.component';

describe('GalleryByThemewiseComponent', () => {
  let component: GalleryByThemewiseComponent;
  let fixture: ComponentFixture<GalleryByThemewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryByThemewiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryByThemewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
