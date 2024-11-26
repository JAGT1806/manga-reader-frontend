import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data?.['role'] as string[];
  const navigationService = inject(NavigationService);

  if(!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  
  if (!requiredRole || !authService.hasAnyRole(requiredRole)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
