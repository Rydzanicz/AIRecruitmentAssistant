import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OcrSnifferService {
  public transcript$ = new BehaviorSubject<string>('');
  public status$ = new BehaviorSubject<string>('Gotowy do OCR');
  private intervalId: any = null;
  private captureArea: { x: number, y: number, width: number, height: number } | null = null;
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;

  get transcript(): Observable<string> {
    return this.transcript$.asObservable();
  }

  get status(): Observable<string> {
    return this.status$.asObservable();
  }

  setCaptureArea(area: { x: number, y: number, width: number, height: number }) {
    this.captureArea = area;
  }

  async startOcr(intervalMs = 1500) {
    if (!this.captureArea) {
      this.status$.next('Najpierw ustaw obszar przechwytywania!');
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      await this.video.play();

      this.status$.next('OCR uruchomiony...');
      this.intervalId = setInterval(() => this.captureAndOcr(), intervalMs);
    } catch (err: any) {
      this.status$.next('Błąd podczas uzyskiwania dostępu do ekranu: ' + (err?.message || err));
    }
  }

  stopOcr() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      this.video = null;
    }
    this.status$.next('OCR zatrzymany');
  }

  private async captureAndOcr() {
    if (!this.video || !this.captureArea) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = this.captureArea.width;
      canvas.height = this.captureArea.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        this.video,
        this.captureArea.x, this.captureArea.y, this.captureArea.width, this.captureArea.height,
        0, 0, this.captureArea.width, this.captureArea.height
      );
      const dataUrl = canvas.toDataURL();

      this.status$.next('Wykonywanie OCR...');
      // Dynamiczny import Tesseract.js tylko w przeglądarce
      const Tesseract = (await import('tesseract.js')).default;
      const result = await Tesseract.recognize(dataUrl, 'pol+eng', { logger: () => {} });
      const text = result.data.text.trim();
      if (text) {
        this.transcript$.next(text);
        this.status$.next('OCR: tekst rozpoznany');
      } else {
        this.status$.next('OCR: brak tekstu');
      }
    } catch (err: any) {
      this.status$.next('Błąd podczas OCR: ' + (err?.message || err));
    }
  }
}
