import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Manga } from '../../models/interfaces/manga.interface';
import { MangaService } from '../../core/services/manga.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SettingsService } from '../../core/services/settings.service';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../models/interfaces/settings.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { Language } from '../../models/enums/language.enum';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MangCardComponent,
    PaginationComponent,
    TranslatePipe
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedLanguage= signal<Language>(Language.ES);
  mangas: Manga[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  noResults = false;
  isLoading: boolean = false;
  settings: AppSettings;
  private subscriptions = new Subscription();
  private maxPages = 9988; // Definimos el máximo de páginas

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private localizationService: LocalizationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
    this.settings = {
      dataSaver: false,
      nfswEnabled: false,
      theme: 'light'
    };
  }

  ngOnInit(): void {
    // Subscribe to route params to handle pagination
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        let page = parseInt(params['page']);
        
        // Validar y corregir la página
        if (!page || isNaN(page) || page < 1) {
          // Si no hay página o es inválida, redirigir a página 1
          this.redirectToPage(1);
        } else if (page > this.maxPages) {
          // Si la página excede el máximo, mostrar noResults
          this.currentPage = page;
          this.noResults = true;
          this.mangas = [];
          this.totalPages = this.maxPages;
        } else {
          // Página válida
          this.currentPage = page;
          this.loadMangas();
        }
      })
    );

    // Subscribe to settings changes
    this.subscriptions.add(
      this.settingsService.settings$.subscribe(newSettings => {
        this.settings = newSettings;
        if (this.currentPage <= this.maxPages) {
          this.loadMangas();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private redirectToPage(page: number): void {
    const currentLang = this.route.snapshot.paramMap.get('lang') || 'es';
    this.router.navigate(['/', currentLang, 'home'], {
      queryParams: { page },
      replaceUrl: true
    });
  }

  loadMangas(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    const offset = (this.currentPage - 1);

    this.subscriptions.add(
      this.mangaService.getAllMangas(
        '', // empty string for no search query
        offset,
        this.pageSize,
        this.settings.nfswEnabled
      ).subscribe({
        next: (response) => {
          this.mangas = response.data;
          this.noResults = this.mangas.length === 0;
          console.log('Response total: ', response.offset, " ", response.limit, " ",  response.total);
          this.totalPages = response.total;
        },
        error: (error) => {
          console.error('Error loading mangas:', error);
          this.noResults = true;
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.maxPages && page !== this.currentPage) {
      this.redirectToPage(page);
    }
  }
}
