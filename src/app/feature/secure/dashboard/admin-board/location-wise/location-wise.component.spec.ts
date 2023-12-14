import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationWiseComponent } from './location-wise.component';

describe('LocationWiseComponent', () => {
  let component: LocationWiseComponent;
  let fixture: ComponentFixture<LocationWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
