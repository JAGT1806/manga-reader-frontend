import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChapterMangaResponse } from '../../interfaces/manga.interface';
import { MangaService } from '../../services/manga.service';

@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.css'
})
export class ChapterComponent {
  pages: string[] = [];
  loadedPages: boolean[] = [];
  currentPage: number = 0;
  loading: boolean = false;
  error: string | null = null;
  useLowQuality: boolean = false;
  originalData: ChapterMangaResponse | null = null;
  preloadedImages: Set<number> = new Set();

  constructor(
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChapter();
  }

  private loadChapter(): void {
    const chapterId = this.route.snapshot.paramMap.get('id');
    if (!chapterId) {
      this.error = 'ID del capítulo no encontrado';
      return;
    }

    this.loading = true;
    this.mangaService.getChapterManga(chapterId).subscribe({
      next: (response) => {
        this.originalData = response;
        this.pages = this.useLowQuality ? response.dataSaver : response.data;
        this.loadedPages = new Array(this.pages.length).fill(false);
        this.loading = false;
        this.preloadNextImages(0); // Comienza la precarga
      },
      error: (error) => {
        console.error('Error loading chapter:', error);
        this.error = 'Error al cargar el capítulo';
        this.loading = false;
      }
    });
  }

  onImageLoad(index: number): void {
    this.loadedPages[index] = true;
    // Precargar las siguientes imágenes
    this.preloadNextImages(index + 1);
  }

  private preloadNextImages(startIndex: number, count: number = 3): void {
    for (let i = startIndex; i < Math.min(startIndex + count, this.pages.length); i++) {
      if (!this.preloadedImages.has(i)) {
        const img = new Image();
        img.src = this.pages[i];
        this.preloadedImages.add(i);
      }
    }
  }

  toggleQuality(): void {
    if (this.originalData) {
      this.pages = this.useLowQuality ? 
        this.originalData.dataSaver : 
        this.originalData.data;
      this.loadedPages = new Array(this.pages.length).fill(false);
      this.preloadedImages.clear();
      this.scrollToPage(this.currentPage);
      this.preloadNextImages(this.currentPage);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.nextPage();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.previousPage();
        break;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      this.scrollToPage(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.scrollToPage(this.currentPage);
    }
  }

  scrollToPage(pageIndex: number): void {
    const element = document.getElementById(`page-' + pageIndex)`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  goBack(): void {
    this.router.navigate(['../']);
  }
}