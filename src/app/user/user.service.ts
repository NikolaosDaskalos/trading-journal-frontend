import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'ui';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  usersURI = 'http://localhost:8080/api/users/';
  httpSub: Subscription | undefined;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private uiService: UiService
  ) {}

  deleteAccount() {
    this.httpSub = this.http.delete(this.usersURI).subscribe({
      next: (resp) => {
        this.authService.logout();
      },
      error: (err) => this.handleErrors(err),
    });
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

  ngOnDestroy(): void {
    this.httpSub?.unsubscribe;
  }
}
