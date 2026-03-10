import { Component } from '@angular/core';

@Component({
  selector: 'app-analog-welcome',

  template: `
    <main class="bg-green-300">
      <section class='bg-red-700'>
      </section>
    </main>
  `,
})
export class AnalogWelcome {
  count = 0;

  increment() {
    this.count++;
  }
}
