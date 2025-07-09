import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechToTextService {
  private recognition: (SpeechRecognition | null) = null;

  isTranscribing = signal(false);
  currentTranscript = signal('');
  error = signal<string | null>(null);

  private getSpeechRecognition(): typeof SpeechRecognition | null {
    if ('webkitSpeechRecognition' in window) {
      return (window as any).webkitSpeechRecognition;
    }
    if ('SpeechRecognition' in window) {
      return (window as any).SpeechRecognition;
    }
    return null;
  }

  startTranscription(): void {
    const SpeechRecognition = this.getSpeechRecognition();

    if (!SpeechRecognition) {
      this.error.set('Przeglądarka nie obsługuje Web Speech API');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pl-PL';

      this.recognition.onstart = () => {
        this.isTranscribing.set(true);
        this.error.set(null);
      };

      // ✅ Właściwe typowanie event parametru
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          this.currentTranscript.update(prev => prev + ' ' + finalTranscript);
        }
      };

      // ✅ Właściwe typowanie error event
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.error.set(`Błąd rozpoznawania mowy: ${event.error}`);
        this.isTranscribing.set(false);
      };

      this.recognition.onend = () => {
        this.isTranscribing.set(false);
      };

      this.recognition.start();

    } catch (error) {
      this.error.set('Nie można uruchomić rozpoznawania mowy');
      this.isTranscribing.set(false);
    }
  }

  stopTranscription(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isTranscribing.set(false);
    }
  }
}
