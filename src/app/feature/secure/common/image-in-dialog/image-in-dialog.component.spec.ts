import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInDialogComponent } from './image-in-dialog.component';

describe('ImageInDialogComponent', () => {
  let component: ImageInDialogComponent;
  let fixture: ComponentFixture<ImageInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
