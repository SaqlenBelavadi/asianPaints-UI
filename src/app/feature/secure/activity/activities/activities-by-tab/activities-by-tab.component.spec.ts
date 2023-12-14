import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesByTabComponent } from './activities-by-tab.component'

describe('ActivitiesByTabComponent', () => {
  let component: ActivitiesByTabComponent;
  let fixture: ComponentFixture<ActivitiesByTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivitiesByTabComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesByTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
