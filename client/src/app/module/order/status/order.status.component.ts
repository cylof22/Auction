import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-status-page',
  styleUrls: [ './order.status.component.css' ],
  templateUrl: './order.status.component.html'
})

export class OrderStatusComponent {
  @Input() title: string = '';
  @Input() active: string = '';

  constructor() {
  }
}

