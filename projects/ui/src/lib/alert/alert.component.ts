import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'shared';

@Component({
  selector: 'lib-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() alert: Alert | undefined;
  @Output() dismiss = new EventEmitter();

  onDismiss() {
    this.dismiss.emit();
  }
}
