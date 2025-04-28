// client/src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  
  constructor(private http: HttpClient) {}
  
  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get user by ID (admin only)
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Update user (admin or user themselves)
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Toggle user active status (admin only)
  toggleUserStatus(id: string): Observable<{ id: string; isActive: boolean }> {
    return this.http.patch<{ id: string; isActive: boolean }>(`${this.apiUrl}/${id}/status`, {})
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Set user role (admin only)
  setUserRole(id: string, role: 'user' | 'admin'): Observable<{ id: string; role: string }> {
    return this.http.patch<{ id: string; role: string }>(`${this.apiUrl}/${id}/role`, { role })
      .pipe(catchError(error => throwError(() => error)));
  }
}