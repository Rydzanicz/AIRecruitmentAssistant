import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class PerplexityService {
    private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';
    private apiKey = 'API'; // wstaw swój klucz API

  constructor(private http: HttpClient) {}

  askWithHistory(messages: ChatMessage[]): Observable<string> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'sonar-pro',
      messages
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response?.choices?.[0]?.message?.content ?? 'Brak odpowiedzi z API')
    );
  }
}
