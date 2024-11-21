import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data?.['role'] as string[];

  if(!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const currentUser = authService.currentUser$;
  
  if (!requiredRole || !authService.hasAnyRole(requiredRole)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
