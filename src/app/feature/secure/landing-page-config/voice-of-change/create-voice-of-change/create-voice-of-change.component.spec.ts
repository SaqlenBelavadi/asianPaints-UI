import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoiceOfChangeComponent } from './create-voice-of-change.component';

describe('CreateVoiceOfChangeComponent', () => {
  let component: CreateVoiceOfChangeComponent;
  let fixture: ComponentFixture<CreateVoiceOfChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVoiceOfChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVoiceOfChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
