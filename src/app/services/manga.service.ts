import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ListMangasResponse, Manga } from '../interfaces/manga.interface';


@Injectable({
  providedIn: 'root'
})
export class MangaService {
  private apiUrl = environment.apiUrl;
  private mangadexCoverUrl = environment.mangadexCoverUrl;

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
        data: response.data.map(manga => ({
          ...manga,
          coverUrl: this.getCoverUrl(manga) // Aquí se asigna la URL construida
        }))
      }))
    );

  }
 
}
