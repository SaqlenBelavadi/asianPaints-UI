import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexColumnChartComponent } from './apex-column-chart.component';

describe('ApexColumnChartComponent', () => {
  let component: ApexColumnChartComponent;
  let fixture: ComponentFixture<ApexColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApexColumnChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
