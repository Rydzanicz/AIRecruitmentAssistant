// src/app/services/audio-capture.service.ts
import { Injectable, signal, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioCaptureService {
  private mediaRecorder = signal<MediaRecorder | null>(null);
  private stream = signal<MediaStream | null>(null);

  isRecording = signal(false);
  audioLevel = signal(0);

  async startMicrophoneCapture(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.setupRecording(stream);
    } catch (error) {
      throw new Error('Nie można uzyskać dostępu do mikrofonu');
    }
  }

  async startTabCapture(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: false
      });

      this.setupRecording(stream);
    } catch (error) {
      throw new Error('Nie można przechwycić audio z karty');
    }
  }

  private setupRecording(stream: MediaStream): void {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    this.mediaRecorder.set(mediaRecorder);
    this.stream.set(stream);
    this.isRecording.set(true);

    // Audio level monitoring
    this.setupAudioLevelMonitoring(stream);
  }

  private setupAudioLevelMonitoring(stream: MediaStream): void {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    microphone.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      if (this.isRecording()) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        this.audioLevel.set(average);
        requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  }

  stopCapture(): void {
    const recorder = this.mediaRecorder();
    const stream = this.stream();

    if (recorder) {
      recorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    this.isRecording.set(false);
    this.mediaRecorder.set(null);
    this.stream.set(null);
  }
}
