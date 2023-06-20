import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.user.pipe(
    take(1),
    tap((user) => {
      if (!user) router.navigate(['/login']);
    })
  );
};
