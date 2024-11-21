import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, tap } from 'rxjs';
import { ChangePasswordRequest, ImageDTO, ImageResponse, ListImgResponse, UpdateUserRequest, UserResponse } from '../../models/interfaces/user.interface';
import { LoginResponse, OkResponse } from '../../models/interfaces/auth.interface';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService
  ) { }

  updateUser(id: number, data: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/user/${id}`, data).pipe(
      tap(response => {
        const currentUser = this.authService.getCurrentUserValue();
        if (currentUser) {
          const updatedUser: LoginResponse = {
            ...currentUser,
            user: response.data
          };
          this.authService.updateStoredUser(updatedUser);
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  deleteUser(id: number): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.API_URL}/user/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }


  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/user/${id}`).pipe(
      tap(response => {
        const currentUser = this.authService.getCurrentUserValue();
        if (currentUser) {
          const updatedUser: LoginResponse = {
            ...currentUser,
            user: response.data
          };
          this.authService.updateStoredUser(updatedUser);
        }
      }),
      catchError(this.errorService.handleError));
  }

  getImages(offset: number = 0, limit: number = 12): Observable<ListImgResponse> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);

    return this.http.get<ListImgResponse>(`${this.API_URL}/img`, { params }).pipe(
      tap(response => console.log("API Response: ", response))
    );
  }

  getImageById(id:number): Observable<ImageDTO> {
    return this.http.get<ImageDTO>(`${this.API_URL}/img/${id}`).pipe(
      catchError(this.errorService.handleError));
  }

  updatePassword(userId: number, request: ChangePasswordRequest): Observable<OkResponse> {
    return this.http.put<OkResponse>(`${this.API_URL}/user/${userId}/password`, request).pipe(
      catchError(this.errorService.handleError));
  }

}
