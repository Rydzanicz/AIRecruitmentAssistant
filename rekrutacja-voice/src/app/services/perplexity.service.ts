import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerplexityService {
    private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';
    private apiKey = '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'; // wstaw swój klucz API

    constructor(private http: HttpClient) {}

    askQuestion(userQuestion: string): Observable<string> {
        const headers = new HttpHeaders({
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        });

        const body = {
            model: 'sonar-pro',
            messages: [
                { role: 'system', content: 'Odpowiadaj wyłącznie w dwóch krótkich, konkretnych zdaniach. Pomijaj szczegóły. Zawsze po polsku' },
                { role: 'user', content: userQuestion }
            ]
        };

        return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
            map(response => response?.choices?.[0]?.message?.content ?? 'Brak odpowiedzi z API')
        );
    }
}
