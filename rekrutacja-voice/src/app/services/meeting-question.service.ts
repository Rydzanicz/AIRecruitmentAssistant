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
      this.error$.next(
        'Twoja przeglądarka nie obsługuje przechwytywania ekranu/audio. Użyj najnowszego Google Chrome lub Microsoft Edge.'
      );
      return;
    }
    try {
      // Musi być video: true, by pojawił się popup wyboru karty!
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
      this.mediaRecorder.start(5000); // co 5s fragment audio
      this.mediaRecorder.onstop = () => this.processAudio();
      this.error$.next(null);
    } catch (err: any) {
      this.error$.next(
        'Nie przyznano uprawnień do przechwytywania ekranu/audio. ' +
        'Podczas wyboru karty z Google Meet lub Teams upewnij się, że zaznaczysz „Udostępnij dźwięk”.'
      );
    }
  }

  stopCapture(): void {
    this.mediaRecorder?.stop();
  }

  private async processAudio() {
    const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const model = 'tiny.en';

    const { supported } = await canUseWhisperWeb(model);
    if (!supported) {
      this.transcript$.next('Whisper-web nie jest wspierany w tej przeglądarce.');
      return;
    }
    await downloadWhisperModel({ model, onProgress: () => {} });

    const channelWaveform = await resampleTo16Khz({
      file: new File([blob], 'audio.wav'),
      onProgress: () => {}
    });

    const { transcription } = await transcribe({
      channelWaveform,
      model,
      onProgress: () => {}
    });
    const text = transcription.map(t => t.text).join(' ');
    this.transcript$.next(text);

    const questions = text.match(/[^.?!]*\?/g) || [];
    questions.forEach(q => this.sendToAI(q.trim()));
  }

  private sendToAI(question: string) {
    this.http.post('/api/ask-ai', { question }).subscribe();
  }
}
