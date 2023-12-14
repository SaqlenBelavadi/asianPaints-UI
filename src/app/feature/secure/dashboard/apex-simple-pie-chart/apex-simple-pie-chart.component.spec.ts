import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexSimplePieChartComponent } from './apex-simple-pie-chart.component';

describe('ApexSimplePieChartComponent', () => {
  let component: ApexSimplePieChartComponent;
  let fixture: ComponentFixture<ApexSimplePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApexSimplePieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexSimplePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
