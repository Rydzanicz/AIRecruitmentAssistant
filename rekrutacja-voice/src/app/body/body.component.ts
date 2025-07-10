import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./body.component.css'],
})
export class BodyComponent {
}
