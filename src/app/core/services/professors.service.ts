import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { Professor, CreateProfessorDto, UpdateProfessorDto } from "../interfaces/professors";
import { Observable, of } from "rxjs";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'})

export class ProfessorsService {
    private apiUrl = 'http://localhost:3000/professors';
    private authUrl = 'http://localhost:3000/auth';
    private platformId = inject(PLATFORM_ID);
    private httpClient = inject(HttpClient);
    
    constructor() { }

    private getHeaders(): HttpHeaders {
      if (!isPlatformBrowser(this.platformId)) {
        return new HttpHeaders();
      }
      const token = localStorage.getItem('access_token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getProfessors(): Observable<Professor[]> {
        if (!isPlatformBrowser(this.platformId)) {
          return of([]);
        }
        return this.httpClient.get<Professor[]>(this.apiUrl, { headers: this.getHeaders() });
    }
    
    getProfessorById(id: string): Observable<Professor> {
        if (!isPlatformBrowser(this.platformId)) {
          return of({} as Professor);
        }
        return this.httpClient.get<Professor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createProfessor(professor: CreateProfessorDto): Observable<Professor> {
        if (!isPlatformBrowser(this.platformId)) {
          return of({} as Professor);
        }
        return this.httpClient.post<Professor>(`${this.authUrl}/register`, professor);
    }
    
    updateProfessor(id: string, professor: UpdateProfessorDto): Observable<Professor> {
        if (!isPlatformBrowser(this.platformId)) {
          return of({} as Professor);
        }
        return this.httpClient.put<Professor>(`${this.apiUrl}/${id}`, professor, { headers: this.getHeaders() });
    }
    
    deleteProfessor(id: string): Observable<void> {
        if (!isPlatformBrowser(this.platformId)) {
          return of(void 0);
        }
        return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
