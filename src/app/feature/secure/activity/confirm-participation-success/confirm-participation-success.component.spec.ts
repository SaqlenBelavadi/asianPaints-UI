import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmParticipationSuccessComponent } from './confirm-participation-success.component';

describe('ConfirmParticipationSuccessComponent', () => {
  let component: ConfirmParticipationSuccessComponent;
  let fixture: ComponentFixture<ConfirmParticipationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmParticipationSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmParticipationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
