import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChatWidgetComponent} from '../Component/chat-widget/chat-widget.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ChatWidgetComponent],
  exports: [ChatWidgetComponent]
})
export class ChatWidgetModule {}
