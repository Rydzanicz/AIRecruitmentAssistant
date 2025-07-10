import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import {BodyViewModel} from '../models/BodyViewModel';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-body',
  standalone: true,
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [NgIf, FormsModule]
})
export class BodyComponent {
  constructor(public vm: BodyViewModel) {}

  ask() {
    this.vm.ask();
  }
}
