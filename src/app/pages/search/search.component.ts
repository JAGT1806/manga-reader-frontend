import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Manga } from '../../interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MangCardComponent,
    PaginationComponent
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  mangas: Manga[] = [];
  noResults = false;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  isLoading: boolean = false;

  constructor(
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['title'] || '';
      this.currentPage = parseInt(params['page']) || 1;

      if (!this.searchQuery.trim()) {
        this.router.navigate(['/home']);
      } else {
        this.fetchMangas();
      }
    });
  }

  fetchMangas(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;

    this.mangaService.getAllMangas(this.searchQuery, offset, this.pageSize).subscribe({
      next: (response) => {
        this.mangas = response.data;
        this.noResults = this.mangas.length === 0;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        
        // Actualizar la URL con los parámetros de búsqueda y página
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
    // Actualizar la URL sin recargar la página
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

