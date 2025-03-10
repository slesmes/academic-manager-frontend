import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private API_URL = 'http://localhost:3000/auth';
    private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(false);
    private platformId = inject(PLATFORM_ID);

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<{ access_token: string }> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const body = {
            email: email,
            password: password
        };
        
        return this.http
            .post<{ access_token: string }>(
                `${this.API_URL}/login`,
                body,
                { 
                    headers,
                    observe: 'response'
                }
            )
            .pipe(
                map(response => {
                    if (response.body && response.body.access_token && isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('access_token', response.body.access_token);
                        this.currentUserSubject.next(true);
                        return response.body;
                    }
                    throw new Error('No se recibió el token de acceso');
                }),
                catchError(error => {
                    console.error('Error:', error);
                    return throwError(() => error);
                })
            );
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('access_token');
        }
        this.currentUserSubject.next(false);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): Observable<boolean> {
        return this.currentUserSubject.asObservable();
    }

    isAuthenticated(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }
        return !!localStorage.getItem('access_token');
    }

    getUserInfo(): DecodedToken | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const token = localStorage.getItem('access_token');
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (error) {
            return null;
        }
    }

    updateProfile(userId: string, data: any): Observable<any> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(null);
        }
        return this.http.put(`${this.API_URL}/profile/${userId}`, data);
    }
}