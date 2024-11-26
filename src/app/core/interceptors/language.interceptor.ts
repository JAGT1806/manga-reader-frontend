import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalizationService } from '../services/localization.service';
import { Language } from '../../models/enums/language.enum';



export const languageInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const lang = getLanguageFromUrl();

    const modifiedReq = req.clone({
      headers: req.headers.set('Accept-Language', lang)
    });


  return next(modifiedReq);
};

function getLanguageFromUrl(): string {
  const path = window.location.pathname;
  const lang = path.split('/')[1];
  return Object.values(Language).includes(lang as Language) ? lang : Language.ES;
}