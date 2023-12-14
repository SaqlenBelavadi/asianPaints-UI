import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminActivityComponent } from './add-admin-activity.component';

describe('AddAdminActivityComponent', () => {
  let component: AddAdminActivityComponent;
  let fixture: ComponentFixture<AddAdminActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdminActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
