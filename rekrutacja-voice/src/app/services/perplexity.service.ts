import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, map} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerplexityService {
    private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';
    private apiKey = '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'; // wstaw swój klucz API

    constructor(private http: HttpClient) {
    }

    /**
     * Wysyła zapytanie do Perplexity API z podanym pytaniem użytkownika.
     * @param userQuestion Treść pytania od użytkownika.
     * @returns Observable z odpowiedzią tekstową od modelu.
     */
    askQuestion(userQuestion: string): Observable<string> {
        const headers = new HttpHeaders({
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        });

        const body = {
            model: 'sonar-pro',
            messages: [
                {
                    "role": "system",
                    "content": "Answer only in two short, precise sentences. No explanations or extra details. Allways answer in Polish."
                },
                {role: 'user', content: userQuestion}
            ]
        };

        return this.http.post<any>(this.apiUrl, body, {headers}).pipe(
            map(response => {
                return response?.choices?.[0]?.message?.content ?? 'Brak odpowiedzi z API';
            })
        );
    }
}
