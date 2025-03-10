import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  showProfileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isAdmin(): boolean {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.role === 'admin';
  }

  isProfessor(): boolean {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.role === 'professor';
  }

  isStudent(): boolean {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.role === 'student';
  }

  getUserRole(): string {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.role || '';
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  editProfile(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
  }
}