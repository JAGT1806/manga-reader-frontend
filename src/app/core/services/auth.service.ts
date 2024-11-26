import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ForgotPasswordRequest, LoginRequest, LoginResponse, OkResponse, RegisterRequest, ResendVerificationRequest, ResetPasswordRequest, UserDTO, VerificationRequest } from '../../models/interfaces/auth.interface';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ErrorService } from './error.service';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'currentUser';
  private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
  private tokenExpirationTimer: any;

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();


  constructor(
    private http: HttpClient,
    private router: Router, 
    private errorService: ErrorService
  ) {
    this.loadStoredUser();
  }


  private loadStoredUser() {
    const storedUser = localStorage.getItem(this.TOKEN_KEY);
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      if(this.isTokenExpired(userData.token)) {
        this.logout();
        return;
      }

      this.currentUserSubject.next(userData);
      this.setAutoLogout(userData.token);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expirationDate = decoded.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expirationDate;
    } catch {
      return true;
    }
  }

  private setAutoLogout(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expirationDate = decoded.exp * 1000; // Convertir a milisegundos
      const timeUntilExpiry = expirationDate - Date.now();
      
      // Limpiar el timer existente si hay uno
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }

      // Establecer nuevo timer para logout automático
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, timeUntilExpiry);

      // Guardar la fecha de expiración
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationDate.toString());
    } catch (error) {
      console.error('Error decodificando token:', error);
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        // Guardar usuario y token
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(response));
        this.currentUserSubject.next(response);
        
        // Configurar auto logout
        this.setAutoLogout(response.token);
        
        // Redirigir según el rol
        if (response.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  register(credentials: RegisterRequest): Observable<OkResponse> {
    return this.http.post<OkResponse>(`${this.API_URL}/register`, credentials).pipe(
      tap(() => {
        this.router.navigate(['/auth/login']);   
      }),
      catchError(this.errorService.handleError)
    );
  }

  logout(redirectPath?: string): void {
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;

    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);

    if(redirectPath) {
      this.router.navigate([redirectPath]);
    }
  }

  //getCurrentSession(): Observable<SessionResponse> {
  //  return this.http.get<SessionResponse>(`${this.API_URL}/session`);
  //}

  validateToken(): Observable<any> {
    return this.http.get(`${this.API_URL}/validate`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getStoredToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.token : null;
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  verifyEmail(data: VerificationRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/verify`, data).pipe(
      tap(() => {
        this.router.navigate(['/auth/login']);
      }),
      catchError(this.errorService.handleError)
    );
  }

  resendVerification(email: ResendVerificationRequest): Observable<OkResponse> {
    return this.http.post<OkResponse>(`${this.API_URL}/resend-validate`, email).pipe(
      catchError(this.errorService.handleError)
    );
  }

  forgotPassword(email: ForgotPasswordRequest): Observable<OkResponse> {
    return this.http.post<OkResponse>(`${this.API_URL}/forgot-password`, email).pipe(
      catchError(this.errorService.handleError)
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<OkResponse> {
    return this.http.post<OkResponse>(`${this.API_URL}/reset-password`, data).pipe(
      tap(() => {
        this.router.navigate(['/auth/login']);
      }),
      catchError(this.errorService.handleError)
    );
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;

    if(!currentUser) return false;

    console.log('currentUser:', currentUser);

    return currentUser.roles.includes(role) || currentUser.user.rol.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  getUserProfile(): UserDTO | null {
    const currentUser = this.currentUserSubject.value;
    console.log('currentUser:', currentUser);
    return currentUser ? currentUser.user : null;
  }

  getFullToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return null;
    return `${currentUser.tokenType} ${currentUser.token}`;
  }

  updateStoredUser(userData: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  getCurrentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

}