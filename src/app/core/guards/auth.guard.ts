import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Durante SSR, permitir el acceso
    }
    
    const token = localStorage.getItem('access_token');
    
    if (token) {
      if (state.url === '/login') {
        // Si está autenticado y trata de ir al login, redirigir a la raíz
        return this.router.createUrlTree(['/']);
      }
      return true;
    }

    // Si no está autenticado, redirigir al login
    return this.router.createUrlTree(['/login']);
  }
} 