import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityDetailsComponent } from './admin-activity-details.component';

describe('AdminActivityDetailsComponent', () => {
  let component: AdminActivityDetailsComponent;
  let fixture: ComponentFixture<AdminActivityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActivityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActivityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
