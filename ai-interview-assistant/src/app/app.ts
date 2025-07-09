import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    DashboardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentView = signal<'dashboard' >('dashboard');

  setView(view: 'dashboard' ): void {
    this.currentView.set(view);
  }
}
