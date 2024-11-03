import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChapterFeed, Manga } from '../../interfaces/manga.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.css'
})
export class MangaComponent implements OnInit {
  manga: Manga | null = null;
  volumes: { volumen: string; chapters: ChapterFeed[] }[] = [];
  loading: boolean = false;

  constructor(
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const mangaId = this.route.snapshot.paramMap.get('id')!;
    this.loadMangaDetails(mangaId);
    this.loadAllMangaFeed(mangaId);
  }

  private loadMangaDetails(id: string): void {
    this.mangaService.getMangaById(id).subscribe((response) => {
      this.manga = response.data;
    });
  }

  private loadAllMangaFeed(id: string): void {
    this.loading = true;
    this.mangaService.getAllMangaFeed(id).subscribe({
      next: (chapters) => {
        this.volumes = this.groupChaptersByVolume(chapters);
        this.sortVolumes();
      },
      error: (error) => {
        console.error('Error loading manga feed:', error);
        // Aquí podrías agregar manejo de errores
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private groupChaptersByVolume(chapters: ChapterFeed[]): { volumen: string; chapters: ChapterFeed[] }[] {
    const volumeMap = new Map<string, ChapterFeed[]>();
    const NO_VOLUME = 'Sin Volumen';

    // Agrupar capítulos por volumen
    chapters.forEach((chapter) => {
      // Determinar el volumen usando null coalescing
      const volumeKey = chapter.atributos.volumen ?? NO_VOLUME;
      
      if (!volumeMap.has(volumeKey)) {
        volumeMap.set(volumeKey, []);
      }
      volumeMap.get(volumeKey)!.push(chapter);
    });

    // Convertir el Map a un array y ordenar los capítulos dentro de cada volumen
    return Array.from(volumeMap.entries()).map(([volumen, chapters]) => ({
      volumen,
      chapters: this.sortChapters(chapters)
    }));
  }

  navigateToChapter(chapterId: string): void {
    this.router.navigate(['/chapter', chapterId]);
  }

  private sortChapters(chapters: ChapterFeed[]): ChapterFeed[] {
    return chapters.sort((a, b) => {
      const capA = a.atributos.capitulo ? parseFloat(a.atributos.capitulo) : Infinity;
      const capB = b.atributos.capitulo ? parseFloat(b.atributos.capitulo) : Infinity;
      return capA - capB;
    });
  }

  private sortVolumes(): void {
    this.volumes.sort((a, b) => {
      if (a.volumen === 'Sin Volumen') return 1;
      if (b.volumen === 'Sin Volumen') return -1;
      
      const volA = parseFloat(a.volumen || '0');
      const volB = parseFloat(b.volumen || '0');
      return volA - volB;
    });
  }
}
