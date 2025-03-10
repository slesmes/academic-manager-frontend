import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Professor, CreateProfessorDto, UpdateProfessorDto } from "../interfaces/professors";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'})

export class ProfessorsService {
    private apiUrl = 'http://localhost:3000/professors';
    private authUrl = 'http://localhost:3000/auth';
    
    constructor(private httpClient: HttpClient) { }

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('access_token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getProfessors(): Observable<Professor[]> {
        return this.httpClient.get<Professor[]>(this.apiUrl, { headers: this.getHeaders() });
    }
    
    getProfessorById(id: string): Observable<Professor> {
        return this.httpClient.get<Professor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createProfessor(professor: CreateProfessorDto): Observable<Professor> {
        return this.httpClient.post<Professor>(`${this.authUrl}/register`, professor);
    }
    
    updateProfessor(id: string, professor: UpdateProfessorDto): Observable<Professor> {
        return this.httpClient.put<Professor>(`${this.apiUrl}/${id}`, professor, { headers: this.getHeaders() });
    }
    
    deleteProfessor(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
