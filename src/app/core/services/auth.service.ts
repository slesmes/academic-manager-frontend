import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private API_URL = 'http://localhost:3000/auth';
    private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(false);

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<{ access_token: string }> {
        return this.http
            .post<{ access_token: string }>(`${this.API_URL}/login`, { email, password })
            .pipe(
                tap((response) => {
                    localStorage.setItem('access_token', response.access_token);
                    this.currentUserSubject.next(true);
                })
            );
    }

    logout() {
        localStorage.removeItem('access_token');
        this.currentUserSubject.next(false);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): Observable<boolean> {
        return this.currentUserSubject.asObservable();
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }
}