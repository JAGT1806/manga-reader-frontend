import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { NavigationService } from '../services/navigation.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);

  if (!authService.isAuthenticated()) {
    navigationService.handleLogout();
    return false;
  }
  
  return true;

};
