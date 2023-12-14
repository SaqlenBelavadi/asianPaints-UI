import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersTalkCreateComponent } from './leaders-talk-create.component';

describe('LeadersTalkCreateComponent', () => {
  let component: LeadersTalkCreateComponent;
  let fixture: ComponentFixture<LeadersTalkCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadersTalkCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadersTalkCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
