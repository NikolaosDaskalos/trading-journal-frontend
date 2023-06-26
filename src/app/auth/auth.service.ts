import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthDTO,
  LOGIN_URL,
  LOGOUT_URL,
  LoginDTO,
  REGISTER_URL,
  User,
  UserDTO,
  getTokenExp,
  getTokenUsername,
} from 'shared';
import { BehaviorSubject, take } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UiService } from 'ui';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  user = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiService: UiService
  ) {}

  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    const userData: {
      username: string;
      _accessToken: string;
      _refreshToken: string;
    } = userDataString ? JSON.parse(userDataString) : null;

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.username,
      userData._accessToken,
      userData._refreshToken
    );

    if (loadedUser.accessToken) {
      this.autoLogout(userData._accessToken);
      this.user.next(loadedUser);
    }
  }

  login(loginDTO: LoginDTO) {
    return this.http.post<AuthDTO>(LOGIN_URL, loginDTO).pipe(
      take(1),
      tap({
        next: (responseData) => this.handleAuthentication(responseData),
        error: (err) => this.handleErrors(err),
      })
    );
  }

  register(user: UserDTO) {
    return this.http.post<AuthDTO>(REGISTER_URL, user).pipe(
      take(1),
      tap({
        next: (responseData) => this.handleAuthentication(responseData),
        error: (err) => this.handleErrors(err),
      })
    );
  }

  private handleAuthentication(authDTO: AuthDTO) {
    const username = getTokenUsername(authDTO.accessToken);
    const user = new User(username!, authDTO.accessToken, authDTO.refreshToken);
    this.user.next(user);
    this.autoLogout(authDTO.accessToken);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogout(token: string) {
    const tokenExpiration = getTokenExp(token);
    const expirationDuration = tokenExpiration! * 1000 - Date.now();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.http.get(LOGOUT_URL);
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['']);
  }

  private handleErrors(err: any) {
    console.log(JSON.stringify(err));
    if (
      err instanceof HttpErrorResponse &&
      err.status === 403 &&
      err.url?.includes('/api/login')
    ) {
      this.createAlert('Wrong Username or Password');
    } else if (err instanceof HttpErrorResponse && err.status !== 0) {
      this.createAlert(err.message);
    } else if (err instanceof HttpErrorResponse && err.status >= 500) {
      this.createAlert('Internal Server error');
    } else {
      this.createAlert('Unexpected error occurred');
    }
  }

  private createAlert(errorMessage: string) {
    this.uiService.newAlert({
      type: 'danger',
      text: errorMessage,
    });
  }
}
