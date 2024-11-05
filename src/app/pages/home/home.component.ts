import { Component, OnDestroy, OnInit } from '@angular/core';
import { Manga } from '../../models/interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../models/interfaces/settings.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MangCardComponent,
    PaginationComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  mangas: Manga[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  noResults = false;
  isLoading: boolean = false;
  settings: AppSettings;
  private subscriptions = new Subscription();
  private maxPages = 833; // Definimos el máximo de páginas

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    this.router.navigate(['/home'], {
      queryParams: { page },
      replaceUrl: true
    });
  }

  loadMangas(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;

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
          this.totalPages = Math.min(Math.ceil(response.total / this.pageSize), this.maxPages);
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
