import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {AudioCaptureService} from '../../services/audio-capture.service';
import {SpeechToTextService} from '../../services/speech-to-text.service';
import {OpenAIService} from '../../services/openai.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private audioCaptureService = inject(AudioCaptureService);
  private speechService = inject(SpeechToTextService);
  private openaiService = inject(OpenAIService);

  selectedMethod = signal<string>('microphone');
  aiResponses = signal<Array<{question: string, answer: string}>>([]);

  audioMethods = [
    { id: 'microphone', name: 'Mikrofon', description: 'Nagrywaj przez mikrofon urządzenia', icon: 'mic' },
    { id: 'tab-capture', name: 'Karta przeglądarki', description: 'Przechwytuj audio z karty', icon: 'tab' },
    { id: 'screen-share', name: 'Udostępnianie ekranu', description: 'Audio podczas screen share', icon: 'screen_share' }
  ];

  isRecording = computed(() => this.audioCaptureService.isRecording());
  audioLevel = computed(() => this.audioCaptureService.audioLevel());
  currentTranscript = computed(() => this.speechService.currentTranscript());

  recordingStatus = computed(() => this.isRecording() ? 'Nagrywanie w toku...' : 'Gotowy do nagrywania');
  canStartRecording = computed(() => !this.isRecording() && !!this.selectedMethod());

  selectMethod(methodId: string): void {
    this.selectedMethod.set(methodId);
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording()) this.stopRecording();
    else await this.startRecording();
  }

  private async startRecording(): Promise<void> {
    try {
      switch (this.selectedMethod()) {
        case 'microphone':    await this.audioCaptureService.startMicrophoneCapture(); break;
        case 'tab-capture':   await this.audioCaptureService.startTabCapture();        break;
        case 'screen-share':  await this.audioCaptureService.startTabCapture();        break;
      }
      this.speechService.startTranscription();
      this.monitorForQuestions();
    } catch (e) {
      console.error('Błąd podczas rozpoczynania nagrywania:', e);
    }
  }

  private stopRecording(): void {
    this.audioCaptureService.stopCapture();
    this.speechService.stopTranscription();
  }

  private monitorForQuestions(): void {
    let lastLen = 0;
    const check = () => {
      const txt = this.currentTranscript();
      if (txt.length > lastLen) {
        const newText = txt.slice(lastLen);
        lastLen = txt.length;
        if (this.isQuestion(newText)) this.generateAIResponse(newText);
      }
      if (this.isRecording()) setTimeout(check, 1000);
    };
    check();
  }

  private isQuestion(text: string): boolean {
    const words = ['jak','co','dlaczego','kiedy','gdzie','czy'];
    const lower = text.toLowerCase();
    return words.some(w => lower.includes(w)) && (text.includes('?') || text.endsWith('.'));
  }

  private async generateAIResponse(question: string): Promise<void> {
    try {
      const answer = await this.openaiService.generateResponse(question);
      this.aiResponses.update(rs => [...rs, { question: question.trim(), answer }]);
    } catch (e) {
      console.error('Błąd generowania odpowiedzi AI:', e);
    }
  }
}
