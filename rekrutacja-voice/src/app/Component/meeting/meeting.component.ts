import { Component, OnInit } from '@angular/core';
import { OcrSnifferService } from '../../services/ocr-sniffer.service';
import { Observable } from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  imports: [
    AsyncPipe
  ],
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent implements OnInit {
  transcript$!: Observable<string>;
  status$!: Observable<string>;

  constructor(private ocrSniffer: OcrSnifferService) {}

  ngOnInit() {
    this.transcript$ = this.ocrSniffer.transcript;
    this.status$ = this.ocrSniffer.status;
  }

  start() {
    this.ocrSniffer.setCaptureArea({ x: 100, y: 700, width: 800, height: 100 });
    this.ocrSniffer.startOcr(1500);
  }

  stop() {
    this.ocrSniffer.stopOcr();
  }
}
