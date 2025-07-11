import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChatWidgetComponent} from '../chat-widget/chat-widget.component';
import {MeetingComponent} from '../meeting/meeting.component';

@Component({
  selector: 'app-body',
  standalone: true,
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [FormsModule, ChatWidgetComponent, MeetingComponent]
})
export class BodyComponent {
}
