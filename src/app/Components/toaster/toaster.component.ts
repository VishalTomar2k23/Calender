import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  messages: { type: string; text: string }[] = [];
  

  constructor() {}

  ngOnInit(): void {}

  // Add a message to the toaster
  showMessage(type: string, text: string, duration: number = 3000): void {
    const message = { type, text };
    this.messages.push(message);

    // Automatically remove the message after the specified duration
    setTimeout(() => {
      this.messages = this.messages.filter((msg) => msg !== message);
    }, duration);
  }
  removeMessage(message: { type: string; text: string }): void {
    this.messages = this.messages.filter((msg) => msg !== message);
  }
}
