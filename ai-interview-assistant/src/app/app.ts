import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SettingsComponent} from './components/settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    DashboardComponent,
    SettingsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentView = signal<'dashboard' | 'settings'>('dashboard');

  setView(view: 'dashboard' | 'settings'): void {
    this.currentView.set(view);
  }
}
