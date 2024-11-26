import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { Language } from '../../models/enums/language.enum';

import { LocalizationService } from '../../core/services/localization.service';
import { AuthService } from '../../core/services/auth.service';
import { LoginResponse } from '../../models/interfaces/auth.interface';
import { NavigationService } from '../../core/services/navigation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  selectedLanguage= signal<Language>(Language.ES);
  Language = Language;
  searchQuery: string = '';
  isSettingsOpen = signal(false);
  currentUser = signal<LoginResponse | null>(null);
  settings = signal({
    dataSaver: false,
    nfswEnabled: false,
    theme: 'light' as 'light' | 'dark'
  });

  get currentLanguage(): Language {
    return this.selectedLanguage();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private localizationService: LocalizationService,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {

    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());

    this.localizationService.currentLanguage$.subscribe(language => this.selectedLanguage.set(language));

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

    // Suscribirse a los cambios del usuario actual
    this.authService.currentUser$.subscribe(
      user => this.currentUser.set(user)
    );
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const currentLang = this.route.snapshot.paramMap.get('lang') || 'es';
    if (this.searchQuery.trim()) {
      this.router.navigate(['/', currentLang, 'search'], { 
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

  async changeLanguage(newLanguage : Language) {
    if (this.selectedLanguage() === newLanguage) return;

    // Obtener la ruta actual
    const urlTree = this.router.parseUrl(this.router.url);
    const urlSegments = urlTree.root.children['primary'].segments.map(segmen => segmen.path);
    const queryParams = urlTree.queryParams;

    console.log('Current URL:', this.router.url);
    console.log('URL tree:', urlTree);
    console.log('URL segments:', urlSegments);
    console.log('Query params:', queryParams);
    console.log('New language:', newLanguage);
    console.log("-----")
    
    // Reemplazar o agregar el segmento de idioma
    if (urlSegments.length >= 2) {
      urlSegments[0] = newLanguage;
    } else {
      urlSegments.unshift(newLanguage);
    }
    console.log('New URL segments:', urlSegments);

    try {
      // Actualizar el idioma en los servicios
      this.settingsService.updateSettings({ language: newLanguage });
      this.localizationService.setLanguage(newLanguage);

      // Navegar a la nueva URL
      await this.router.navigate([`/${urlSegments.join('/')}`], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    } catch (error) {
      console.error('Error al cambiar el idioma:', error);
      // Manejar el error según sea necesario
    }
  }

  onLogout(): void {
    this.navigationService.handleLogout();
    //this.router.navigate(['/login']);
  }

  isAdmin1(): boolean {
    return this.currentUser()?.roles.includes('ROLE_ADMIN') || false ;
  }
}