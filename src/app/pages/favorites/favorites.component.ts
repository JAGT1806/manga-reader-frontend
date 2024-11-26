import { Component, signal } from '@angular/core';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { FavoriteDTO } from '../../models/interfaces/favorites.interface';
import { FavoritesService } from '../../core/services/favorites.service';
import { SettingsService } from '../../core/services/settings.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../core/services/localization.service';
import { Language } from '../../models/enums/language.enum';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MangCardComponent, PaginationComponent, TranslatePipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  selectedLanguage= signal<Language>(Language.ES);
  favorites: FavoriteDTO[] = [];
  currentPage = 1;
  totalPages = 0;
  pageSize = 12;
  isDeleting = false;
  canDeleteFavorites = true;

  constructor(
    private favoritesService: FavoritesService, 
    private settingsService: SettingsService,
    private localizationService: LocalizationService,
    private translate: TranslateService
  ) {
    this.selectedLanguage.set(this.localizationService.getCurrentLanguage());
  }

  ngOnInit(): void {
    this.loadFavorites();
  }

  onDeleteFavorite(favorite: FavoriteDTO): void {
    if (!this.canDeleteFavorites) return;

    this.translate.get('CONFIRM.DELETE.FAVORITE', { name: favorite.nameManga }).
    subscribe((res: string) => {
      if (confirm(res)) {
        this.isDeleting = true;
        
        this.favoritesService.removeFavorite(favorite.idManga).subscribe({
          next: () => {
            this.loadFavorites(this.currentPage);
            this.isDeleting = false;
          },
          error: () => {
            this.isDeleting = false;
          }
        });
      }
    })
    
  }


  loadFavorites(page: number = 1): void {
    console.log('Page ' + page);
    this.currentPage = page;
    const offset = (this.currentPage - 1);
    console.log('Offset ' + offset);

    this.favoritesService.getFavoritesByUser(offset, this.pageSize).subscribe({
      next: (response) => {
        this.favorites = response.data;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      },
      error: (error) => {
        
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page !== this.currentPage) {
      this.loadFavorites(page);
    }
  }
}
