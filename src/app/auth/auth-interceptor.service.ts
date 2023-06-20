import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user?.accessToken) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        return next.handle(modifiedReq);
      })
    );
  }

  constructor(private authService: AuthService) {}
}
