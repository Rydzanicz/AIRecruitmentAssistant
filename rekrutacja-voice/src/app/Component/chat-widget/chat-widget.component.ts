import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PerplexityService } from '../../services/perplexity.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  imports: [NgIf, FormsModule]
})
export class ChatWidgetComponent {
  question = '';
  answer = '';
  loading = false;
  dragging = false;
  pos = { x: 100, y: 100 };

  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  constructor(private perplexity: PerplexityService) {}

  ask() {
    if (!this.question.trim() || this.loading) return;
    this.loading = true;
    this.answer = '';
    this.perplexity.askQuestion(this.question).subscribe({
      next: (res: string) => {
        this.answer = res;
        this.loading = false;
      },
      error: () => {
        this.answer = 'Błąd komunikacji z Perplexity';
        this.loading = false;
      }
    });
  }

  focusInput() {
    setTimeout(() => this.chatInput?.nativeElement.focus(), 0);
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
