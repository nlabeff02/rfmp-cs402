// client/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'recipe_planner_token';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }
  
  // Load user from localStorage on service initialization
  private loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }
  
  // Register a new user
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => throwError(() => error))
      );
  }
  
  // Login user
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => throwError(() => error))
      );
  }
  
  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`)
      .pipe(
        tap(user => this.userSubject.next(user)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  
  // Handle authentication response
  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.userSubject.next(response.user);
  }
  
  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  // Get auth token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  // Check if user is admin
  isAdmin(): boolean {
    const user = this.userSubject.value;
    return !!user && user.role === 'admin';
  }
}