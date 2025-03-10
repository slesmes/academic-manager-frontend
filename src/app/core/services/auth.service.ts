import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private API_URL = 'http://localhost:3000/auth';
    private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(false);

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<{ access_token: string }> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        const body = {
            email: email,
            password: password
        };

        console.log('URL:', `${this.API_URL}/login`);
        console.log('Body:', body);
        console.log('Headers:', headers);
        
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
                    console.log('Respuesta completa del servidor:', response);
                    if (response.body && response.body.access_token) {
                        localStorage.setItem('access_token', response.body.access_token);
                        this.currentUserSubject.next(true);
                        return response.body;
                    }
                    throw new Error('No se recibió el token de acceso');
                }),
                catchError(error => {
                    console.error('Error completo:', error);
                    console.error('Estado:', error.status);
                    console.error('Mensaje:', error.error);
                    return throwError(() => error);
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