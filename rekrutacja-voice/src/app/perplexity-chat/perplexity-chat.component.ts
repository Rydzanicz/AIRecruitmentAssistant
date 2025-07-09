import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerplexityService } from '../services/perplexity.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-perplexity-chat',
  standalone: true,
  templateUrl: './perplexity-chat.component.html',
  styleUrls: ['./perplexity-chat.component.scss'],
  imports: [FormsModule, NgIf]
})
export class PerplexityChatComponent {
  question = '';
  answer = '';
  loading = false;

  constructor(private perplexity: PerplexityService) {}

  ask() {
    if (!this.question.trim()) return;
    this.loading = true;
    this.answer = '';
    this.perplexity.askPerplexity(this.question).subscribe({
      next: (res) => {
        this.answer = res?.answer || 'Brak odpowiedzi';
        this.loading = false;
      },
      error: () => {
        this.answer = 'Błąd komunikacji z Perplexity';
        this.loading = false;
      }
    });
  }
}
