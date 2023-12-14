import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersTalkComponent } from './leaders-talk.component';

describe('LeadersTalkComponent', () => {
  let component: LeadersTalkComponent;
  let fixture: ComponentFixture<LeadersTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadersTalkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadersTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
