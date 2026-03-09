import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const rol = authService.getRol();

  if (rol === 'superadmin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};