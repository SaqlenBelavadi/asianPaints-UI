import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoRecordsMessageComponent } from './no-records-message.component';

describe('NoRecordsMessageComponent', () => {
  let component: NoRecordsMessageComponent;
  let fixture: ComponentFixture<NoRecordsMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoRecordsMessageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRecordsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
