import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  transcribe,
  canUseWhisperWeb,
  downloadWhisperModel,
  resampleTo16Khz
} from '@remotion/whisper-web';

@Injectable({ providedIn: 'root' })
export class MeetingQuestionService {
  private transcript$ = new BehaviorSubject<string>('');
  private error$ = new BehaviorSubject<string | null>(null);
  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private fullTranscript = '';

  constructor(private http: HttpClient) {}

  get transcript(): Observable<string> {
    return this.transcript$.asObservable();
  }

  get error(): Observable<string | null> {
    return this.error$.asObservable();
  }

  clearError() {
    this.error$.next(null);
  }

  async startCapture(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      this.error$.next('Twoja przeglądarka nie obsługuje przechwytywania ekranu/audio.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true;

      // Wydarzenie wywoływane co 2 sekundy
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log('Otrzymano fragment audio:', event.data.size, 'bajtów');

          // Przetwarzanie fragmentu audio
          this.processAudioChunk();
        }
      };

      // Rozpoczęcie nagrywania z fragmentami co 2 sekundy
      this.mediaRecorder.start(2000);
      this.error$.next(null);
      this.transcript$.next('Rozpoczęto nagrywanie... Przetwarzanie audio...');

      // Automatyczne żądanie danych co 3 sekundy
      this.startPeriodicDataRequest();

    } catch (err: any) {
      this.error$.next('Nie przyznano uprawnień do przechwytywania ekranu/audio.');
    }
  }

  private startPeriodicDataRequest() {
    const interval = setInterval(() => {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.requestData();
      } else {
        clearInterval(interval);
      }
    }, 3000);
  }

  stopCapture(): void {
    this.isRecording = false;
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    this.transcript$.next(this.fullTranscript || 'Zatrzymano nagrywanie.');
  }

  private async processAudioChunk() {
    if (this.audioChunks.length === 0) return;

    try {
      const blob = new Blob(this.audioChunks, { type: 'audio/wav' });

      if (blob.size < 1000) { // Pomijamy bardzo małe fragmenty
        return;
      }

      const model = 'tiny.en';
      this.transcript$.next(this.fullTranscript + ' [Przetwarzanie...]');

      const { supported } = await canUseWhisperWeb(model);
      if (!supported) {
        this.transcript$.next('Whisper-web nie jest wspierany w tej przeglądarce.');
        return;
      }

      // Pobierz model tylko raz
      if (!(window as any).whisperModelLoaded) {
        await downloadWhisperModel({ model, onProgress: () => {} });
        (window as any).whisperModelLoaded = true;
      }

      const channelWaveform = await resampleTo16Khz({
        file: new File([blob], 'audio.wav'),
        onProgress: () => {}
      });

      const { transcription } = await transcribe({
        channelWaveform,
        model,
        onProgress: () => {}
      });

      const newText = transcription.map(t => t.text).join(' ');
      if (newText.trim()) {
        this.fullTranscript += newText + ' ';
        this.transcript$.next(this.fullTranscript);

        // Wykrywanie pytań
        const questions = newText.match(/[^.?!]*\?/g) || [];
        questions.forEach(q => this.sendToAI(q.trim()));
      }

      // Wyczyść przetworzony audio
      this.audioChunks = [];

    } catch (error) {
      console.error('Błąd przetwarzania audio:', error);
      this.transcript$.next(this.fullTranscript + ' [Błąd przetwarzania]');
    }
  }

  private sendToAI(question: string) {
    console.log('Wykryto pytanie:', question);

  }
}
