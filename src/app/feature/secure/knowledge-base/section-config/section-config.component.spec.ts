import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionConfigComponent } from './section-config.component';

describe('SectionConfigComponent', () => {
  let component: SectionConfigComponent;
  let fixture: ComponentFixture<SectionConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
