import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  private adminRoutes = [
    '/departments',
    '/professors',
    '/students',
    '/courses',
    '/enrollments',
    '/evaluations'
  ];

  private studentRoutes = [
    '/courses',
    '/enrollments',
    '/profile'
  ];

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      return this.router.createUrlTree(['/login']);
    }

    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      return this.router.createUrlTree(['/login']);
    }

    // Si intenta acceder al login estando autenticado
    if (state.url === '/login') {
      return this.router.createUrlTree(['/profile']);
    }

    // Verificar permisos según el rol
    if (userInfo.role === 'admin') {
      return true; // Los admins tienen acceso a todo
    } else if (userInfo.role === 'student') {
      // Si es estudiante, verificar si tiene acceso a la ruta
      if (!this.studentRoutes.includes(state.url)) {
        return this.router.createUrlTree(['/profile']); // Redirigir a perfil si no tiene acceso
      }
      return true;
    }

    // Por defecto, redirigir al login
    return this.router.createUrlTree(['/login']);
  }
} 
