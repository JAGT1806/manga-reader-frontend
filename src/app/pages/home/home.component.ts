import { Component, OnInit } from '@angular/core';
import { Manga } from '../../interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MangCardComponent } from "../../components/mang-card/mang-card.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';

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
export class HomeComponent implements OnInit {
  mangas: Manga[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  visiblePages: number = 5;
  pageNumbers: (number | string)[] = []; // Cambiar a (number | string) para incluir '...'
  pageInput: number | null = null;

  constructor(private mangaService: MangaService) {}

  ngOnInit(): void {
    this.loadMangas();
  }

  loadMangas(): void {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.mangaService.getAllMangas('', offset, this.pageSize).subscribe(response => {
      this.mangas = response.data;
      this.totalPages = Math.ceil(response.total / this.pageSize);

    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMangas();
  }
}
