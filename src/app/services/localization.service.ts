import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/enums/language.enum';

interface LanguageConfig {
  port: number;
  baseUrl: string;
  prefix: string;
}  

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private languageConfigs: Record<Language, LanguageConfig> = {
    [Language.ES]: {
      port: 4200,
      baseUrl: 'http://localhost:4200',
      prefix: '/es'
    },
    [Language.EN]: {
      port: 4201,
      baseUrl: 'http://localhost:4201',
      prefix: '/en'
    },
    [Language.FR]: {
      port: 4202,
      baseUrl: 'http://localhost:4202',
      prefix: '/fr'
    }
  };

  getLanguageConfig(language: Language): LanguageConfig {
    return this.languageConfigs[language];
  }

  getCurrentLanguage(): Language {
    const port = window.location.port;
    const found = Object.entries(this.languageConfigs).find(([_, config]) => 
      config.port.toString() === port
    );
    return found ? found[0] as Language : Language.EN;
  }

  navigateToLanguage(language: Language) {
    const config = this.languageConfigs[language];
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    const pathSegments = currentPath.split('/').filter(segment =>
      segment !== 'en' && segment !== 'es' && segment !== 'fr' && segment !== ''
    );
    // Reconstruir la ruta
    const newPath = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/home';
    
    // Construir la nueva URL completa
    const newUrl = `${config.baseUrl}${config.prefix}${newPath}${currentSearch}`;
    window.location.href = newUrl;
  }
}
