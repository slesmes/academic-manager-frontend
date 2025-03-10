import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule]
})
export class AppComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const isLoginPage = this.router.url === '/login';
      return !isLoginPage && !!localStorage.getItem('access_token');
    }
    return false;
  }
} 