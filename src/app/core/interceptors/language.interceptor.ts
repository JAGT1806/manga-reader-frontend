import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

export const languageInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const localizationService = inject(LocalizationService);
    const currentLanguage = localizationService.getCurrentLanguage();

    const modifiedReq = req.clone({
      headers: req.headers.set('Accept-Language', currentLanguage)
    });


  return next(modifiedReq);
};
