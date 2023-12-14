import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailsComponent } from './activity-details.component';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

describe('ActivityDetailsComponent', () => {
  let component: ActivityDetailsComponent;
  let fixture: ComponentFixture<ActivityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
