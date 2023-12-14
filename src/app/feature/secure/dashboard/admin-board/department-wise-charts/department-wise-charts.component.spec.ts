import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentWiseChartsComponent } from './department-wise-charts.component';

describe('DepartmentWiseChartsComponent', () => {
  let component: DepartmentWiseChartsComponent;
  let fixture: ComponentFixture<DepartmentWiseChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentWiseChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentWiseChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
