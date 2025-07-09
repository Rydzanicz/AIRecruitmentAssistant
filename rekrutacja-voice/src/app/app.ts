import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RecruiterTranscriptComponent} from './recruiter-transcript/recruiter-transcript.component';
import {PerplexityChatComponent} from './perplexity-chat/perplexity-chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecruiterTranscriptComponent, PerplexityChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'rekrutacja-voice';
}
