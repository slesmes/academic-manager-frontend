import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Student } from "../interfaces/students";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'})

export class StudentService {
    apiUrl = 'http://localhost:3000/students';
    constructor(private httpClient: HttpClient) { }

    getStudent(): Observable<Student[]> {
        return this.httpClient.get<Student[]>(this.apiUrl);
      }
    
      getStudentById(id: string): Observable<Student> {
        return this.httpClient.get<Student>(`${this.apiUrl}/${id}`);
      }
      createStudent(Student: Student): Observable<Student> {
        return this.httpClient.post<Student>(this.apiUrl, Student);
      }
    
      updateStudent(Student: Student): Observable<Student> {
        return this.httpClient.put<Student>(`${this.apiUrl}/${Student.id}`, Student);
      }
    
      deleteStudent(id: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${id}`);
      }
    
      searchStudent(id: string): Observable<Student> {
        return this.httpClient.get<Student>(`${this.apiUrl}/${id}`);
      }
}