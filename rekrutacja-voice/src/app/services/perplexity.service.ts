import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {
  private apiUrl = 'https://api.perplexity.ai/v1/ask'; // przykładowy endpoint
  private apiKey = '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'; // wstaw swój klucz API

  constructor(private http: HttpClient) {}

  askPerplexity(question: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      query: question
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
