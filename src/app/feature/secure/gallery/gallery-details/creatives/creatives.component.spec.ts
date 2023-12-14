import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativesComponent } from './creatives.component';

describe('CreativesComponent', () => {
  let component: CreativesComponent;
  let fixture: ComponentFixture<CreativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreativesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
