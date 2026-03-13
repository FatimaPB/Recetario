import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verificarRol().pipe(

    map((res: any) => {

      if (res.rol === 'superadmin') {
        return true;
      }

      router.navigate(['/dashboard']);
      return false;

    }),

    catchError(() => {

      router.navigate(['/login']);
      return of(false);

    })

  );

};