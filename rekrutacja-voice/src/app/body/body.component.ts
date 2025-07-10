import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import {BodyViewModule} from '../models/body-view.module';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-body',
  standalone: true,
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [NgIf, FormsModule]
})
export class BodyComponent {
  constructor(public vm: BodyViewModule) {}

  ask() {
    this.vm.ask();
  }
}
