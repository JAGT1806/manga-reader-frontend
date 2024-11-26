import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MangCardComponent } from '../../components/mang-card/mang-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteDTO } from '../../models/interfaces/favorites.interface';
import { UserDTO } from '../../models/interfaces/auth.interface';
import { AdminService } from '../../core/services/admin.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [CommonModule, MangCardComponent, PaginationComponent],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css'
})
export class UserFavoritesComponent {
  userId!: number;
  user: UserDTO | null = null;
  favorites: FavoriteDTO[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 12;
  isDeleting = false;
  canDeleteFavorites = true; // Configurable según tus necesidades

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = + params['id'];

      const currentUser = this.authService.getUserProfile();

      if (currentUser && this.userId === currentUser.idUser) {
        this.router.navigate(['/favorites']);
        return;
      }

      this.loadUserData();
      this.loadFavorites();
    });
  }

  loadUserData(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadFavorites(page: number = 1): void {
    const offset = (page - 1) * this.pageSize;

    this.adminService.getUserFavorites(this.userId, offset, this.pageSize).subscribe({
      next: (response) => {
        this.favorites = response.data;
        this.currentPage = (offset / this.pageSize) + 1;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onPageChange(page: number): void {
    this.loadFavorites(page);
  }

  onDeleteFavorite(favorite: FavoriteDTO): void {
    if (!this.canDeleteFavorites) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${favorite.nameManga}" de los favoritos de ${this.user?.username}?`)) {
      this.isDeleting = true;
      
      this.adminService.deleteFavorite(this.userId, favorite.idManga).subscribe({
        next: () => {
          this.loadFavorites(this.currentPage);
          this.isDeleting = false;
        },
        error: () => {
          this.isDeleting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

