import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messageBar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.css'],
})
export class MessageBarComponent {
  @Input() errors: string[] = [] as string[];
  @Input() successes: string[] = [] as string[];

  addErrorTimeOut(error: string, ms = 7000) {
    if (ms < 4000) ms = 7000;
    this.errors.push(error);
    setTimeout(async () => {
      await this.errorClick(error);
    }, ms);
  }

  addSuccessTimeOut(success: string, ms = 4000) {
    if (ms < 4000) ms = 4000;
    this.successes.push(success);
    setTimeout(async () => {
      await this.successClick(success);
    }, ms);
  }

  async errorClick(clickedError: string): Promise<void> {
    const indexOfMessage = this.errors.indexOf(clickedError);
    for (let i = 0; i < indexOfMessage; i++) {
      const messageElement = document.getElementById(
        'error-' + i
      ) as HTMLElement;
      messageElement.classList.add('drop-element-animation');
    }

    const messageElement = document.getElementById(
      'error-' + indexOfMessage
    ) as HTMLElement;
    messageElement.classList.add('close-message-animation');
    setTimeout(() => {
      this.errors.splice(indexOfMessage, 1);
      for (let i = 0; i < indexOfMessage; i++) {
        const messageElement = document.getElementById(
          'error-' + i
        ) as HTMLElement;
        messageElement.classList.remove('drop-element-animation');
      }
    }, 500);
  }

  async successClick(clickedSuccess: string): Promise<void> {
    const indexOfMessage = this.successes.indexOf(clickedSuccess);

    for (let i = 0; i < indexOfMessage; i++) {
      const messageElement = document.getElementById(
        'successes-' + i
      ) as HTMLElement;
      messageElement.classList.add('drop-element-animation');
    }

    for (let errorIndex = 0; errorIndex < this.errors.length; errorIndex++) {
      const messageElement = document.getElementById(
        'error-' + errorIndex
      ) as HTMLElement;
      messageElement.classList.add('drop-element-animation');
    }

    const messageElement = document.getElementById(
      'successes-' + indexOfMessage
    ) as HTMLElement;
    messageElement.classList.add('close-message-animation');
    setTimeout(() => {
      this.successes.splice(indexOfMessage, 1);
      for (let i = 0; i < indexOfMessage; i++) {
        const messageElement = document.getElementById(
          'successes-' + i
        ) as HTMLElement;
        messageElement.classList.remove('drop-element-animation');
      }

      for (let errorIndex = 0; errorIndex < this.errors.length; errorIndex++) {
        const messageElement = document.getElementById(
          'error-' + errorIndex
        ) as HTMLElement;
        messageElement.classList.remove('drop-element-animation');
      }
    }, 500);
  }
}
