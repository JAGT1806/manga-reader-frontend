import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChapterFeed, Manga } from '../../interfaces/manga.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { AppSettings } from '../../interfaces/settings.interface';

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.css'
})
export class MangaComponent implements OnInit, OnDestroy {
  manga: Manga | null = null;
  volumes: { volumen: string; chapters: ChapterFeed[] }[] = [];
  loading: boolean = false;
  settings: AppSettings;
  private subscriptions = new Subscription();
  
  constructor(
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    // Initialize settings with default values
    this.settings = {
      dataSaver: false,
      nfswEnabled: false,
      theme: 'light'
    };
  }

  ngOnInit(): void {
    const mangaId = this.route.snapshot.paramMap.get('id');
    if (!mangaId) {
      this.router.navigate(['/home']);
      return;
    }

    // Combine manga details and settings observables
    this.subscriptions.add(
      combineLatest([
        this.mangaService.getMangaById(mangaId),
        this.settingsService.settings$
      ]).subscribe({
        next: ([mangaResponse, newSettings]) => {
          this.manga = mangaResponse.data;
          this.settings = newSettings;
          this.loadAllMangaFeed(mangaId);
        },
        error: (error) => {
          console.error('Error loading manga details:', error);
          this.router.navigate(['/home']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadAllMangaFeed(id: string): void {
    if (this.loading) return;
    
    this.loading = true;
    
    this.subscriptions.add(
      this.mangaService.getAllMangaFeed(id, this.settings.nfswEnabled)
        .subscribe({
          next: (chapters) => {
            this.volumes = this.groupChaptersByVolume(chapters);
            this.sortVolumes();
          },
          error: (error) => {
            console.error('Error loading manga feed:', error);
          },
          complete: () => {
            this.loading = false;
          }
        })
    );
  }

  private groupChaptersByVolume(chapters: ChapterFeed[]): { volumen: string; chapters: ChapterFeed[] }[] {
    const volumeMap = new Map<string, ChapterFeed[]>();
    const NO_VOLUME = 'Sin Volumen';

    chapters.forEach((chapter) => {
      const volumeKey = chapter.atributos.volumen ?? NO_VOLUME;
      
      if (!volumeMap.has(volumeKey)) {
        volumeMap.set(volumeKey, []);
      }
      volumeMap.get(volumeKey)!.push(chapter);
    });

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
