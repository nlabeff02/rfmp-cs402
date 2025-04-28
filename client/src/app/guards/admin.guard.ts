// client/src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Check if user is admin
    if (this.authService.isAdmin()) {
      return true;
    }
    
    // Not admin, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}