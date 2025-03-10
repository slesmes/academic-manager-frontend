import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { Observable, of } from "rxjs";
import { Department, DepartmentDto } from '../interfaces/departments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl: string = 'http://localhost:3000/departments';
  private platformId = inject(PLATFORM_ID);

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDepartments(): Observable<Department[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return this.httpClient.get<Department[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getDepartmentById(id: string): Observable<Department> {
    if (!isPlatformBrowser(this.platformId)) {
      return of({} as Department);
    }
    return this.httpClient.get<Department>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createDepartment(department: DepartmentDto): Observable<Department> {
    if (!isPlatformBrowser(this.platformId)) {
      return of({} as Department);
    }
    return this.httpClient.post<Department>(this.apiUrl, department, { headers: this.getHeaders() });
  }

  updateDepartment(department: Department): Observable<Department> {
    if (!isPlatformBrowser(this.platformId)) {
      return of({} as Department);
    }
    return this.httpClient.put<Department>(`${this.apiUrl}/${department.id}`, department, { headers: this.getHeaders() });
  }

  deleteDepartment(id: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(void 0);
    }
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchDepartment(id: string): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
