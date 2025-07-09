import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import {SpeechRecognition} from '../services/speech-recognition';

@Component({
  selector: 'app-recruiter-transcript',
  standalone: true,
  templateUrl: './recruiter-transcript.component.html',
  styleUrls: ['./recruiter-transcript.component.scss'],
  imports: [NgIf]
})
export class RecruiterTranscriptComponent {
  constructor(public service: SpeechRecognition) {}

  start() {
    this.service.start();
  }

  stop() {
    this.service.stop();
  }
}
