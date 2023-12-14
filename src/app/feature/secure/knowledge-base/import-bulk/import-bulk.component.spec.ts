import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBulkComponent } from './import-bulk.component';

describe('ImportBulkComponent', () => {
  let component: ImportBulkComponent;
  let fixture: ComponentFixture<ImportBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBulkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
