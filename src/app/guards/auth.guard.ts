import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verificarSesion().pipe(

    map(() => true),

    catchError(() => {

      router.navigate(['/login']);
      return of(false);

    })

  );

};