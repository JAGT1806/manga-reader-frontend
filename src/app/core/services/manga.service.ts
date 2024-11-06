import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { ChapterFeed, ChapterMangaResponse, FeedMangaResponse, ListMangasResponse, Manga, MangaResponse } from '../../models/interfaces/manga.interface';


@Injectable({
  providedIn: 'root'
})
export class MangaService {
  private apiUrl = environment.apiUrl;
  private mangadexCoverUrl = environment.mangadexCoverUrl;
  private readonly MAX_OFFSET = 9976;

  constructor(private http: HttpClient) { }

  getCoverUrl(manga: Manga): string {
    return `${this.mangadexCoverUrl}/${manga.id}/${manga.fileName}`;
  }

  getAllMangas(title: string = '', offset: number = 0, limit: number = 12, nsfw: boolean = false): Observable<ListMangasResponse> {
    let params = new HttpParams()
    .set('offset', offset)
    .set('limit', limit)
    .set('nsfw', nsfw);

    if (title) {
      params = params.set('title', title);
    }

    return this.http.get<ListMangasResponse>(`${this.apiUrl}/manga`, { params }).pipe(
      map(response => ({
        ...response,
        total: response.total > this.MAX_OFFSET + limit ? 
          this.MAX_OFFSET + limit : 
          response.total,
        data: response.data.map(manga => ({
          ...manga,
          coverUrl: this.getCoverUrl(manga) // Aquí se asigna la URL construida
        }))
      }))
    );

  }

  getMangaById(id: string): Observable<MangaResponse> {
    return this.http.get<MangaResponse>(`${this.apiUrl}/manga/${id}`).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          coverUrl: this.getCoverUrl(response.data)
        }
      }))
    );
  }

  getAllMangaFeed(id: string, nsfw: boolean = false): Observable<ChapterFeed[]> {
    return this.getFeedRecursive(id, 0, nsfw);
  }

  private getFeedRecursive(id: string, offset: number = 0, nsfw: boolean = false): Observable<ChapterFeed[]> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', 100)
      .set('nsfw', nsfw);

    return this.http.get<FeedMangaResponse>(`${this.apiUrl}/manga/${id}/feed`, { params }).pipe(
      expand(response => {
        const nextOffset = response.offset + response.limit;
        if (nextOffset >= response.total) {
          return EMPTY;
        }

        const nextParams = new HttpParams()
          .set('offset', nextOffset)
          .set('limit', 100)
          .set('nsfw', nsfw);

        return this.http.get<FeedMangaResponse>(`${this.apiUrl}/manga/${id}/feed`, { params: nextParams });
      }),
      map(response => response.data),
      reduce((acc, current) => [...acc, ...current], [] as ChapterFeed[])
    );
  }

  getChapterManga(id: string): Observable<ChapterMangaResponse> {
    return this.http.get<ChapterMangaResponse>(`${this.apiUrl}/manga/chapter/${id}`);
  }
}
