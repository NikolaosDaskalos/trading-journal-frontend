import { Injectable } from '@angular/core';
import { Alert } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  deleteAlertTimeout: any = null;
  deleteAlertAfter = 3000; //3 seconds
  alerts: Alert[] = [];

  newAlert(alert: Alert) {
    this.alerts.push(alert);

    this.deleteAlertTimeout = setTimeout(
      () => this.alerts.splice(0, 1),
      this.deleteAlertAfter
    );
  }

  alertDismiss(index: number) {
    this.alerts.splice(index, 1);
  }
}
