import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alert, STATS_URL, TRADES_URL, TradeDTO, dashboardDTO } from 'shared';
import { take } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { UiService } from 'ui';

@Injectable()
export class TradeService {
  constructor(private http: HttpClient, private uiService: UiService) {}

  getAllTrades() {
    return this.http
      .get<TradeDTO[]>(TRADES_URL)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  createTrade(trade: TradeDTO) {
    return this.http
      .post<TradeDTO>(TRADES_URL, trade)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  updateTrade(trade: TradeDTO) {
    return this.http
      .put<TradeDTO>(`${TRADES_URL}/${trade.id}`, trade)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  deleteTrade(id: number) {
    return this.http
      .delete(`${TRADES_URL}/${id}`)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  searchTrades(ticker: string) {
    return this.http
      .get<TradeDTO[]>(`${TRADES_URL}/search/${ticker}`)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  getDashboard() {
    return this.http
      .get<dashboardDTO>(STATS_URL)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  showRowValidationErrors(group: AbstractControl) {
    const alerts: Alert[] = [];

    Object.keys(group).forEach((key) => {
      const controlErrors: any = group.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          alerts.push({
            type: 'danger',
            text: `form error - ${key}: ${keyError}`,
          });
        });
      }
    });

    alerts.forEach((alert) => this.uiService.newAlert(alert));
  }

  handleErrors(err: any) {
    if (err instanceof HttpErrorResponse && err.status === 400) {
      this.uiService.newAlert({ type: 'danger', text: err.message });
    } else if (err instanceof HttpErrorResponse && err.status === 403) {
      this.uiService.newAlert({
        type: 'danger',
        text: 'Your credentials expired please login',
      });
    } else if (err instanceof HttpErrorResponse && err.status >= 500) {
      this.uiService.newAlert({
        type: 'danger',
        text: 'Internal Server error',
      });
    } else {
      this.uiService.newAlert({
        type: 'danger',
        text: 'Unexpected error occurred',
      });
    }
  }
}
