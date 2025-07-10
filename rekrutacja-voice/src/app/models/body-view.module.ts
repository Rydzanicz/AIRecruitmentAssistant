import { Injectable } from '@angular/core';
import { PerplexityService } from '../services/perplexity.service';

@Injectable({ providedIn: 'root' })
export class BodyViewModule {
  question = '';
  answer = '';
  loading = false;

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
}
