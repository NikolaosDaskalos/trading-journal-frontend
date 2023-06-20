import { Component, OnDestroy, OnInit } from '@angular/core';
import { TradeService } from '../trade.service';
import { dashboardDTO } from 'shared';
import { Subscription } from 'rxjs';
import { UiService } from 'ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private tradeService: TradeService,
    private uiService: UiService
  ) {}

  dashboard: dashboardDTO | undefined;
  serviceSub: Subscription | undefined;
  alerts = this.uiService.alerts;

  ngOnInit() {
    this.serviceSub = this.tradeService.getDashboard().subscribe({
      next: (resp) => (this.dashboard = resp),
    });
  }

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }

  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
  }
}
