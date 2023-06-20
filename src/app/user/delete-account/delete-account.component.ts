import { Component } from '@angular/core';

import { UiService } from 'ui';
import { UserService } from '../user.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
})
export class DeleteAccountComponent {
  alerts = this.uiService.alerts;

  constructor(private userService: UserService, private uiService: UiService) {}

  onDelete() {
    this.userService.deleteAccount();
  }

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }
}
