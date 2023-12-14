import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceDetailsComponent } from './finance-details.component';

describe('FinanceDetailsComponent', () => {
  let component: FinanceDetailsComponent;
  let fixture: ComponentFixture<FinanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
