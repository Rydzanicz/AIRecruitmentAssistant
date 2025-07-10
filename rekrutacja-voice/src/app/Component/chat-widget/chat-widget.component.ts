import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import {NgIf, NgFor, NgClass} from '@angular/common';
import { PerplexityService, ChatMessage } from '../../services/perplexity.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  imports: [NgIf, NgFor, FormsModule, NgClass]
})
export class ChatWidgetComponent implements AfterViewInit {
  question = '';
  loading = false;
  dragging = false;
  pos = { x: 100, y: 100 };
  history: ChatMessage[] = [];

  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatHistory') chatHistory!: ElementRef<HTMLDivElement>;

  constructor(private perplexity: PerplexityService) {}

  ngAfterViewInit() {
    this.focusInput();
  }

  ask() {
    if (!this.question.trim() || this.loading) return;
    this.history.push({ role: 'user', content: this.question });
    this.loading = true;
    this.perplexity.askWithHistory(this.getFullHistory()).subscribe({
      next: (res: string) => {
        this.history.push({ role: 'assistant', content: res });
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.history.push({ role: 'assistant', content: 'Błąd komunikacji z Perplexity' });
        this.loading = false;
        this.scrollToBottom();
      }
    });
    this.question = '';
    this.scrollToBottom();
  }

  getFullHistory(): ChatMessage[] {
    return [
      { role: 'system', content: 'Odpowiadaj krótko i rzeczowo.' },
      ...this.history
    ];
  }

  focusInput() {
    setTimeout(() => this.chatInput?.nativeElement.focus(), 0);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatHistory) {
        this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
      }
    }, 0);
  }

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
