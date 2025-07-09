import {inject, Injectable, signal} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private http = inject(HttpClient);
  private apiKey = signal('');

  setApiKey(key: string): void {
    this.apiKey.set(key);
    localStorage.setItem('openai_api_key', key);
  }

  async generateResponse(question: string): Promise<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey()}`,
      'Content-Type': 'application/json'
    });

    const prompt = `
      Jako ekspert HR, udziel profesjonalnej odpowiedzi na pytanie rekrutacyjne: "${question}"

      Twoja odpowiedź powinna:
      - Być konkretna i praktyczna
      - Zawierać przykłady z doświadczenia
      - Być długa na 2-3 zdania
      - Być w języku polskim

      Odpowiedź:
    `;

    const body = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Jesteś ekspertem HR pomagającym w przygotowaniu do rozmowy kwalifikacyjnej.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>('https://api.openai.com/v1/chat/completions', body, { headers })
      );

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('Błąd podczas generowania odpowiedzi AI');
    }
  }
}
