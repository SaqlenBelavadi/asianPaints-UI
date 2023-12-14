import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseComponent } from './employee-wise.component';

describe('EmployeeWiseComponent', () => {
  let component: EmployeeWiseComponent;
  let fixture: ComponentFixture<EmployeeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
