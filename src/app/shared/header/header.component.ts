import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { Language } from '../../models/enums/language.enum';

import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import { LocalizationService } from '../../core/services/localization.service';

registerLocaleData(localeFr);
registerLocaleData(localeEs);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  selectedLanguage= Language.EN;
  Language = Language;
  searchQuery: string = '';
  isSettingsOpen = signal(false);
  settings = signal({
    dataSaver: false,
    nfswEnabled: false,
    theme: 'light' as 'light' | 'dark'
  });

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private localizationService: LocalizationService
  ) {

    this.selectedLanguage = this.localizationService.getCurrentLanguage();
    // Aplicar el tema inicial inmediatamente
    const initialSettings = this.settingsService.getSettings();
    document.documentElement.setAttribute('data-bs-theme', initialSettings.theme);


    // Usar effect para mantener sincronizado el tema
    effect(() => {
      const currentTheme = this.settings().theme;
      document.documentElement.setAttribute('data-bs-theme', currentTheme);
    });
  }

  ngOnInit() {
    // Inicializar settings
    this.settings.set(this.settingsService.getSettings());

    // Suscribirse a cambios en settings
    this.settingsService.settings$.subscribe(
      newSettings => this.settings.set(newSettings)
    );
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { 
          title: this.searchQuery,
          nsfw: this.settings().nfswEnabled 
        } 
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  toggleDataSaver(): void {
    this.settingsService.updateSettings({
      dataSaver: !this.settings().dataSaver
    });
  }

  toggleNSFW(): void {
    this.settingsService.updateSettings({
      nfswEnabled: !this.settings().nfswEnabled
    });
  }

  toggleTheme(): void {
    const newTheme = this.settings().theme === 'light' ? 'dark' : 'light';
    this.settingsService.updateSettings({ theme: newTheme });
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  }

  changeLanguage(language : Language) {
    this.selectedLanguage = language;
    this.settingsService.updateSettings({ language });
    this.localizationService.navigateToLanguage(language);
  }

}