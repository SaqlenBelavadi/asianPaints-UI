import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutEvpComponent } from './about-evp.component';

describe('AboutEvpComponent', () => {
  let component: AboutEvpComponent;
  let fixture: ComponentFixture<AboutEvpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutEvpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
