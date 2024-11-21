import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const userProfile = authService.getUserProfile();
    // Si el usuario es admin, redirigir al dashboard, sino al home
    if (authService.hasRole('ROLE_ADMIN')) {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }
  
  return true;
};
