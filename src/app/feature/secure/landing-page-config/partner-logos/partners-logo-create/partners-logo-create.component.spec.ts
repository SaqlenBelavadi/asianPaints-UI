import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersLogoCreateComponent } from './partners-logo-create.component';

describe('PartnersLogoCreateComponent', () => {
  let component: PartnersLogoCreateComponent;
  let fixture: ComponentFixture<PartnersLogoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersLogoCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersLogoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
