import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Manga } from '../../models/interfaces/manga.interface';
import { MangaService } from '../../core/services/manga.service';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { SettingsService } from '../../core/services/settings.service';
import { AppSettings } from '../../models/interfaces/settings.interface';
import { combineLatest, Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../core/services/localization.service';
import { Language } from '../../models/enums/language.enum';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MangCardComponent,
    PaginationComponent,
    TranslatePipe
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  selectedLanguage= signal<Language>(Language.ES);
  mangas: Manga[] = [];
  noResults = false;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  isLoading: boolean = false;
  settings: AppSettings;
  
  private subscriptions = new Subscription();

  constructor(
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private localizationService: LocalizationService
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
    // Initialize settings with default values
    this.settings = {
      dataSaver: false,
      nfswEnabled: false,
      theme: 'light'
    };
  }

  ngOnInit(): void {
    // Combine settings and query params observables
    this.subscriptions.add(
      combineLatest([
        this.route.queryParams,
        this.settingsService.settings$
      ]).subscribe(([params, newSettings]) => {
        this.settings = newSettings;
        this.searchQuery = params['title'] || '';
        this.currentPage = parseInt(params['page']) || 1;

        if (!this.searchQuery.trim()) {
          this.router.navigate(['/home']);
        } else {
          this.fetchMangas();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchMangas(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;

    this.mangaService.getAllMangas(
      this.searchQuery,
      offset,
      this.pageSize,
      this.settings.nfswEnabled,
    ).subscribe({
      next: (response) => {
        this.mangas = response.data;
        this.noResults = this.mangas.length === 0;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        
        this.updateUrlParams();
      },
      error: (error) => {
        console.error('Error fetching mangas:', error);
        this.noResults = true;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateUrlParams();
      this.fetchMangas();
    }
  }

  private updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        title: this.searchQuery,
        page: this.currentPage
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}

