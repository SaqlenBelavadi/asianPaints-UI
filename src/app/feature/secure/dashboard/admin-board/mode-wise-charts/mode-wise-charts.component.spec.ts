import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeWiseChartsComponent } from './mode-wise-charts.component';

describe('ModeWiseChartsComponent', () => {
  let component: ModeWiseChartsComponent;
  let fixture: ComponentFixture<ModeWiseChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeWiseChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeWiseChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
