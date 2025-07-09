import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {OpenAIService} from '../../services/openai.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private openaiService = inject(OpenAIService);

  connectionStatus = signal<{type: string, message: string} | null>(null);

  settingsForm = this.fb.group({
    apiKey: ['', Validators.required],
    model: ['gpt-4']
  });

  ngOnInit(): void {
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedModel = localStorage.getItem('ai_model');

    if (savedApiKey) {
      this.settingsForm.patchValue({ apiKey: savedApiKey });
    }
    if (savedModel) {
      this.settingsForm.patchValue({ model: savedModel });
    }
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      const { apiKey, model } = this.settingsForm.value;
      this.openaiService.setApiKey(apiKey!);
      localStorage.setItem('ai_model', model!);
      this.connectionStatus.set({
        type: 'success',
        message: 'Ustawienia zostały zapisane!'
      });
    }
  }

  async testConnection(): Promise<void> {
    try {
      const { apiKey } = this.settingsForm.value;
      if (!apiKey) {
        this.connectionStatus.set({
          type: 'error',
          message: 'Wprowadź klucz API przed testem'
        });
        return;
      }
      this.openaiService.setApiKey(apiKey);
      await this.openaiService.generateResponse('Test connection');
      this.connectionStatus.set({
        type: 'success',
        message: 'Połączenie z OpenAI działa poprawnie!'
      });
    } catch (error) {
      this.connectionStatus.set({
        type: 'error',
        message: 'Błąd połączenia z OpenAI. Sprawdź klucz API.'
      });
    }
  }
}
