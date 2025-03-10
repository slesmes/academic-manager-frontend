import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Student, CreateStudentDto, UpdateStudentDto } from "../interfaces/students";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'})

export class StudentService {
    private apiUrl = 'http://localhost:3000/students';
    private authUrl = 'http://localhost:3000/auth';
    
    constructor(private httpClient: HttpClient) { }

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('access_token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getStudent(): Observable<Student[]> {
        return this.httpClient.get<Student[]>(this.apiUrl, { 
          headers: this.getHeaders()
        });
    }
    
    getStudentById(id: string): Observable<Student> {
        return this.httpClient.get<Student>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createStudent(student: CreateStudentDto): Observable<Student> {
        return this.httpClient.post<Student>(`${this.authUrl}/register`, student);
    }
    
    updateStudent(id: string, student: UpdateStudentDto): Observable<Student> {
        return this.httpClient.put<Student>(`${this.apiUrl}/${id}`, student, { headers: this.getHeaders() });
    }
    
    deleteStudent(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}