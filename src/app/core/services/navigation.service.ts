import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private authService: AuthService) { }

  handleLogout() {
    const currentUrl = this.router.url;

    const protectedRoutes = ['/dashboard', '/profile', '/dashboard'];

    const refreshRoutes = ['/manga'];

    if(protectedRoutes.some(route => currentUrl.startsWith(route))) {
      this.authService.logout('/auth/login');
    } else if (refreshRoutes.some(route => currentUrl.startsWith(route))) {
      this.authService.logout();
      window.location.reload();
    } else {
      this.authService.logout();
    }

  }
}
