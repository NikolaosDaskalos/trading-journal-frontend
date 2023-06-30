import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { take, tap } from 'rxjs';
import { UiService } from 'ui';
import { AuthService } from '../auth/auth.service';
import { USERS_URL, User, UserDTO } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private uiService: UiService
  ) {}

  user = this.authService.user;

  deleteAccount() {
    this.http.delete(USERS_URL).pipe(
      take(1),
      tap({
        next: (resp) => {
          this.authService.logout();
        },
        error: (err) => this.handleErrors(err),
      })
    );
  }

  getUser(username: string) {
    return this.http.get<UserDTO>(`${USERS_URL}/${username}`).pipe(
      take(1),
      tap({
        error: (err) => this.handleErrors(err),
      })
    );
  }

  updateUser(user: UserDTO) {
    return this.http.put<UserDTO>(USERS_URL, user).pipe(
      take(1),
      tap({
        error: (err) => this.handleErrors(err),
      })
    );
  }

  handleErrors(err: any) {
    if (err.status === 400) {
      this.uiService.newAlert({
        type: 'danger',
        text: JSON.stringify(err.error),
      });
    } else if (err.status === 403) {
      this.uiService.newAlert({
        type: 'danger',
        text: 'Your credentials expired please login',
      });
    } else if (err.status === 409) {
      this.uiService.newAlert({
        type: 'danger',
        text: 'Email already exists',
      });
    } else if (err.status >= 500) {
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
