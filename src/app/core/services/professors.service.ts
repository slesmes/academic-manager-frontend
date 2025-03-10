import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Professor, CreateProfessorDto, UpdateProfessorDto } from "../interfaces/professors";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'})

export class ProfessorsService {
    private apiUrl = 'http://localhost:3000/professors';
    private authUrl = 'http://localhost:3000/auth';
    
    constructor(private httpClient: HttpClient) { }

    getProfessors(): Observable<Professor[]> {
        return this.httpClient.get<Professor[]>(this.apiUrl);
    }
    
    getProfessorById(id: string): Observable<Professor> {
        return this.httpClient.get<Professor>(`${this.apiUrl}/${id}`);
    }

    createProfessor(professor: CreateProfessorDto): Observable<Professor> {
        return this.httpClient.post<Professor>(`${this.authUrl}/register`, professor);
    }
    
    updateProfessor(id: string, professor: UpdateProfessorDto): Observable<Professor> {
        return this.httpClient.put<Professor>(`${this.apiUrl}/${id}`, professor);
    }
    
    deleteProfessor(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
    }
}
