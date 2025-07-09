import { TestBed } from '@angular/core/testing';

import { SpeechRecognition } from './speech-recognition';

describe('SpeechRecognition', () => {
  let service: SpeechRecognition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechRecognition);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
