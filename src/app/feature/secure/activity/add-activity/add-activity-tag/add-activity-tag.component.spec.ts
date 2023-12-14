import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityTagComponent } from './add-activity-tag.component';

describe('AddActivityTagComponent', () => {
  let component: AddActivityTagComponent;
  let fixture: ComponentFixture<AddActivityTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
