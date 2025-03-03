import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Department } from '../interfaces/departments';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl: string = 'http://localhost:3000/departments';

  constructor(private httpClient: HttpClient) { }

 
  getDepartments(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}/${id}`);
  }
  createDepartment(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(this.apiUrl, department);
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.httpClient.put<Department>(`${this.apiUrl}/${department.id}`, department);
  }

  deleteDepartment(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  searchDepartment(id: string): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}/${id}`);
  }
}
