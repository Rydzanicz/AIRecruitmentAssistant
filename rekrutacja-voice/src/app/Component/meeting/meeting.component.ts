import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingQuestionService } from '../../services/meeting-question.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent {
  transcript$: Observable<string>;
  error$: Observable<string | null>;

  constructor(private svc: MeetingQuestionService) {
    this.transcript$ = this.svc.transcript;
    this.error$ = this.svc.error;
  }

  start() {
    this.svc.startCapture();
  }

  stop() {
    this.svc.stopCapture();
  }

  clearError() {
    this.svc.clearError();
  }
}
