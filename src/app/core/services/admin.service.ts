import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListUserResponse, UserResponse, UsersRequest } from '../../models/interfaces/user.interface';
import { ListFavoritesResponse } from '../../models/interfaces/favorites.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getUsers(params: {
    username?: string;
    email?: string;
    role?: string;
    offset?: number;
    limit?: number;
    enabled?: boolean | null;
  }): Observable<ListUserResponse> {
    let httpParams = new HttpParams();

    // Solo agregamos los parámetros que tienen valor
    if (params.username) httpParams = httpParams.set('username', params.username);
    if (params.email) httpParams = httpParams.set('email', params.email);
    if (params.role) httpParams = httpParams.set('role', params.role);
    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.enabled !== undefined && params.enabled !== null) {
      httpParams = httpParams.set('enabled', params.enabled);
    }

    return this.http.get<ListUserResponse>(`${this.API_URL}/user`, { params: httpParams });
  }

  getUserFavorites(userId: number, offset: number = 0, limit: number = 12): Observable<ListFavoritesResponse> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get<ListFavoritesResponse>(`${this.API_URL}/favorites/${userId}`, { params });
  }

  deleteFavorite(userId: number, mangaId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/favorites/${userId}`, {
      params: new HttpParams().set('manga', mangaId)
    });
  }

}
