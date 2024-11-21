import { Component } from '@angular/core';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { FavoriteDTO } from '../../models/interfaces/favorites.interface';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MangCardComponent, PaginationComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favorites: FavoriteDTO[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 12;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(page: number = 1): void {
    const offset = (page - 1) * this.pageSize;

    this.favoritesService.getFavoritesByUser(0 ,offset, this.pageSize).subscribe({
      next: (response) => {
        this.favorites = response.data;
        this.currentPage = (offset / this.pageSize) + 1;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      },
      error: (error) => {
        console.error('Error cargando favoritos', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.loadFavorites(page);
  }
}
