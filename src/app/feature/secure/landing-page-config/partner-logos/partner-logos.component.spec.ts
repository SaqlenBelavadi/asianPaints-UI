import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerLogosComponent } from './partner-logos.component';

describe('PartnerLogosComponent', () => {
  let component: PartnerLogosComponent;
  let fixture: ComponentFixture<PartnerLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerLogosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
