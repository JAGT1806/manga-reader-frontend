import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const languageGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const lang : string | null = route.paramMap.get('lang');
  const validLanguages = ['es', 'en', 'fr'];
  
  if (typeof lang !== 'string' || !validLanguages.includes(lang)) {
    //router.navigate(['/es/home']); // Redirigir al idioma por defecto
    return false;
  }
  
  return true;
};
