import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { FavoritesRequest, ListFavoritesResponse } from '../../models/interfaces/favorites.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly APIURL = `${environment.apiUrl}/favorites`
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFavorite(offset= 0, limit= 12): Observable<ListFavoritesResponse> {
    
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get<ListFavoritesResponse>(`${this.APIURL}`, { params });
  }

  getFavoritesByUser(userId: number, offset = 0, limit = 12): Observable<ListFavoritesResponse> {
    const userId1 = this.authService.getUserProfile()?.idUser;

    const params = new HttpParams()
    .set('id', userId1 || userId)
    .set('offset', offset)
    .set('limit', limit);
    return this.http.get<ListFavoritesResponse>(`${this.APIURL}/${userId1}`, { params });
  }

  checkFavoriteExists(mangaId: string): Observable<boolean> {
    const userId = this.authService.getUserProfile()?.idUser;
    if (!userId) return new Observable(obs => obs.next(false));

    return this.http.get<boolean>(`${this.APIURL}/exist`, {
      params: new HttpParams()
        .set('id', userId)
        .set('manga', mangaId)
    });
  }

  addFavorite(mangaId: string, nameManga: string, urlImage: string): Observable<any> {
    const userId = this.authService.getUserProfile()?.idUser;
    if (!userId) return new Observable(obs => obs.error('User not authenticated'));

    const request: FavoritesRequest = {
      idManga: mangaId,
      userId: userId,
      nameManga: nameManga,
      urlImage: urlImage
    };

    return this.http.post(this.APIURL, request);
  }

  removeFavorite(mangaId: string): Observable<any> {
    const userId = this.authService.getUserProfile()?.idUser;
    if (!userId) return new Observable(obs => obs.error('User not authenticated'));

    return this.http.delete(`${this.APIURL}/${userId}`, {
      params: new HttpParams().set('manga', mangaId)
    });
  }
}
