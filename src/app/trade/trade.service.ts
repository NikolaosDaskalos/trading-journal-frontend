import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alert, TradeDTO, dashboardDTO } from 'shared';
import { take } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { UiService } from 'ui';

@Injectable()
export class TradeService {
  tradesURI = 'http://localhost:8080/api/trades';

  constructor(private http: HttpClient, private uiService: UiService) {}

  getAllTrades() {
    return this.http
      .get<TradeDTO[]>(this.tradesURI)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  createTrade(trade: TradeDTO) {
    return this.http
      .post<TradeDTO>(this.tradesURI, trade)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  updateTrade(trade: TradeDTO) {
    return this.http
      .put<TradeDTO>(`${this.tradesURI}/${trade.id}`, trade)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  deleteTrade(id: number) {
    return this.http
      .delete(`${this.tradesURI}/${id}`)
      .pipe(take(1), tap({ error: (err) => this.handleErrors(err) }));
  }

  getDashboard() {
    return this.http
      .get<dashboardDTO>('http://localhost:8080/api/stats')
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
