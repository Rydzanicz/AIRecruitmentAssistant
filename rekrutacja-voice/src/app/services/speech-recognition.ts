import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognition {
  recognition: any;
  isListening = false;
  transcript = '';

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const { webkitSpeechRecognition }: IWindow = window as any;
      if (webkitSpeechRecognition) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = 'pl-PL';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.transcript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          this.zone.run(() => {
            this.transcript += interim;
          });
        };
      }
    }
  }

  start() {
    if (this.recognition) {
      this.isListening = true;
      this.transcript = '';
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition) {
      this.isListening = false;
      this.recognition.stop();
    }
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
