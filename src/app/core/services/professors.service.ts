import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Professor } from "../interfaces/professors";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'})

export class ProfessorsService {
    apiUrl = 'http://localhost:3000/professors';
    constructor(private httpClient: HttpClient) { }

    getProfessors(): Observable<Professor[]> {
        return this.httpClient.get<Professor[]>(this.apiUrl);
      }
    
      getProfessorById(id: string): Observable<Professor> {
        return this.httpClient.get<Professor>(`${this.apiUrl}/${id}`);
      }
      createProfessor(Professor: Professor): Observable<Professor> {
        return this.httpClient.post<Professor>(this.apiUrl, Professor);
      }
    
      updateProfessor(Professor: Professor): Observable<Professor> {
        return this.httpClient.put<Professor>(`${this.apiUrl}/${Professor.id}`, Professor);
      }
    
      deleteProfessor(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}`);
      }
    
      searchProfessor(id: string): Observable<Professor> {
        return this.httpClient.get<Professor>(`${this.apiUrl}/${id}`);
      }
}
