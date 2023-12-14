import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtVideosCreateComponent } from './yt-videos-create.component';

describe('YtVideosCreateComponent', () => {
  let component: YtVideosCreateComponent;
  let fixture: ComponentFixture<YtVideosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YtVideosCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YtVideosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
