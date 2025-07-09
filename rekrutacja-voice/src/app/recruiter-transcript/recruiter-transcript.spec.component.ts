import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SpeechRecognition} from '../services/speech-recognition';
import {RecruiterTranscriptComponent} from './recruiter-transcript.component';

describe('RecruiterTranscriptComponent', () => {
  let component: RecruiterTranscriptComponent;
  let fixture: ComponentFixture<RecruiterTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterTranscriptComponent ],
      providers: [ SpeechRecognition ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
