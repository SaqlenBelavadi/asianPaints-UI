import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackByThemewiseComponent } from './feedback-by-themewise.component';

describe('FeedbackByThemewiseComponent', () => {
  let component: FeedbackByThemewiseComponent;
  let fixture: ComponentFixture<FeedbackByThemewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackByThemewiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackByThemewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
