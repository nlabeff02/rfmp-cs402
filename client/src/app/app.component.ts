// client/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin' || false;
      this.username = user?.username || '';
    });
    
    // Track route changes to update UI
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll to top on route change
      window.scrollTo(0, 0);
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}