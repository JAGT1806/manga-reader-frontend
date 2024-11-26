import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LocalizationService } from '../services/localization.service';
import { Language } from '../../models/enums/language.enum';

export const languageGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const localizationService = inject(LocalizationService);
  
  const urlLang = route.paramMap.get('lang');

  if(!urlLang || !Object.values(Language).includes(urlLang as Language)) {
    const defaultLanguage = localizationService.getCurrentLanguage();
    
    const redirectUrl = state.url.replace(/^\/[^\/]*/, '')
    router.navigate([`/${defaultLanguage}${redirectUrl}`]);
  }

  localizationService.setLanguage(urlLang as Language);
  
  return true;
};
