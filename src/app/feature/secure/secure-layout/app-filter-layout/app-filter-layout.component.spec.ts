import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFilterLayoutComponent } from './app-filter-layout.component';

describe('AppFilterLayoutComponent', () => {
  let component: AppFilterLayoutComponent;
  let fixture: ComponentFixture<AppFilterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFilterLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFilterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
