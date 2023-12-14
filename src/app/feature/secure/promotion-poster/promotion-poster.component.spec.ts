import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionPosterComponent } from './promotion-poster.component';

describe('PromotionPosterComponent', () => {
  let component: PromotionPosterComponent;
  let fixture: ComponentFixture<PromotionPosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionPosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionPosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
