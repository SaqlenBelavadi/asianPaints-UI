import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeWiseChartsComponent } from './theme-wise-charts.component';

describe('ThemeWiseChartsComponent', () => {
  let component: ThemeWiseChartsComponent;
  let fixture: ComponentFixture<ThemeWiseChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeWiseChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeWiseChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
