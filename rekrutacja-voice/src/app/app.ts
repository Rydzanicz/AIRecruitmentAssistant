import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RecruiterTranscriptComponent} from './recruiter-transcript/recruiter-transcript.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecruiterTranscriptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'rekrutacja-voice';
}
