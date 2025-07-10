import { Component, HostListener } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent {
  question = '';
  answer = '';
  loading = false;
  dragging = false;
  pos = { x: 100, y: 100 };

  ask() {
    // Wstaw wywołanie serwisu API
  }

  // Drag & drop obsługa
  startDrag(event: MouseEvent) {
    this.dragging = true;
    document.body.style.userSelect = 'none';
  }
  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (this.dragging) {
      this.pos.x = event.clientX - 150;
      this.pos.y = event.clientY - 20;
    }
  }
  @HostListener('document:mouseup')
  stopDrag() {
    this.dragging = false;
    document.body.style.userSelect = '';
  }
}
