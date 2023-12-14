import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceOfChangeComponent } from './voice-of-change.component';

describe('VoiceOfChangeComponent', () => {
  let component: VoiceOfChangeComponent;
  let fixture: ComponentFixture<VoiceOfChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceOfChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceOfChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
