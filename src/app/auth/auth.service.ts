import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDTO, LoginDTO, User, UserDTO, getTokenExp } from 'shared';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

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
    return this.http
      .post<AuthDTO>('http://localhost:8080/api/login', loginDTO)
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            return throwError(() => 'Wrong Username or Password');
          } else if (err instanceof HttpErrorResponse && err.status >= 500) {
            return throwError(() => 'Internal Server error');
          } else {
            return throwError(() => 'Unexpected error occurred');
          }
        }),
        tap((responseData) => {
          this.handleAuthentication(responseData, loginDTO.username.trim());
        })
      );
  }

  register(user: UserDTO) {
    return this.http
      .post<AuthDTO>('http://localhost:8080/api/register', user)
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 409) {
            return throwError(() => err.error);
          } else if (err instanceof HttpErrorResponse && err.status >= 500) {
            return throwError(() => 'Internal Server error');
          } else {
            return throwError(() => 'Unexpected error occurred');
          }
        }),
        tap((responseData) => {
          this.handleAuthentication(responseData, user.username.trim());
        })
      );
  }

  private handleAuthentication(authDTO: AuthDTO, username: string) {
    const user = new User(username, authDTO.accessToken, authDTO.refreshToken);
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
    this.http.get('http://localhost:8080/api/logout');
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['']);
  }
}
