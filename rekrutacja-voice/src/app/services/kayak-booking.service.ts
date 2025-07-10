import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KayakBookingService {
  private apiUrl = 'http://localhost:8080';
  private apiKey =
    'VIGGO=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJWSUdHTyIsImlhdCI6MTczMzM5MTE2OCwiZXhwIjoxNzMzNDI3MTY4fQ.8QE--sghB1EU8u_bbmsETQ_RuY2W7P5HEbBo7twkyH8';
  private http: HttpClient | undefined;

  constructor(private injector: Injector) {
  }

  private getHttp(): HttpClient {
    if (!this.http) {
      this.http = this.injector.get(HttpClient);
    }
    return this.http;
  }

  sendBuyerData(buyerData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': this.apiKey,
    });

    return this.getHttp().post(`${this.apiUrl}/save-order`, buyerData, {
      headers,
      responseType: 'text' as 'json',
    });
  }
}
