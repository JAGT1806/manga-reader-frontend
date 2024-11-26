import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Language } from '../../models/enums/language.enum';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLanguageSubject = new BehaviorSubject<Language>(Language.ES);
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private router: Router
  ) { 
    translate.addLangs(['en', 'es', 'fr']);
    translate.setDefaultLang('es');

    const initialLang = this.getInitialLanguage();
    this.setLanguage(initialLang);

    // Suscribirse a los cambios de ruta para mantener sincronizado el idioma
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const urlLang = this.getLanguageFromUrl();
      if (urlLang && urlLang !== this.currentLanguageSubject.value) {
        this.setLanguage(urlLang);
      }
    });
  }

  private getInitialLanguage(): Language {
    const urlLang = this.getLanguageFromUrl();
    const storedLang = localStorage.getItem('selectedLanguage') as Language;

    if (urlLang && Object.values(Language).includes(urlLang)) {
      return urlLang;
    }
    
    if (storedLang && Object.values(Language).includes(storedLang)) {
      return storedLang;
    }

    return Language.ES;
  }

  private getLanguageFromUrl(): Language {
    const path = window.location.pathname;
    const lang = path.split('/')[1];
    return Object.values(Language).includes(lang as Language) 
      ? lang as Language 
      : Language.ES;
  }

  setLanguage(language: Language) {
    if (!Object.values(Language).includes(language)) {
      language = Language.ES;
    }

    this.currentLanguageSubject.next(language);
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }
}
