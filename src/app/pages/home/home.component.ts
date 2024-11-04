import { Component, OnDestroy, OnInit } from '@angular/core';
import { Manga } from '../../interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../interfaces/settings.interface';

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
  isLoading: boolean = false;
  settings: AppSettings;
  private subscriptions = new Subscription();

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize settings with default values
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
        this.currentPage = parseInt(params['page']) || 1;
        this.loadMangas();
      })
    );

    // Subscribe to settings changes
    this.subscriptions.add(
      this.settingsService.settings$.subscribe(newSettings => {
        this.settings = newSettings;
        this.loadMangas();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
          this.totalPages = Math.ceil(response.total / this.pageSize);
          this.updateUrlParams();
        },
        error: (error) => {
          console.error('Error loading mangas:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateUrlParams();
    }
  }

  private updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
