import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-state-page',
  styleUrls: [ './order.state.component.css' ],
  templateUrl: './order.state.component.html'
})

export class OrderStateComponent {
  @Input() title: string = '';
  @Input() active: string = '';

  constructor() {
  }
}

