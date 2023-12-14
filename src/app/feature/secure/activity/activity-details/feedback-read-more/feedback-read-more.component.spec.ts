import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackReadMoreComponent } from './feedback-read-more.component';

describe('FeedbackReadMoreComponent', () => {
  let component: FeedbackReadMoreComponent;
  let fixture: ComponentFixture<FeedbackReadMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackReadMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
