import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Department } from '../interfaces/departments';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  apiUrl: string = 'http://localhost:3000/departments';
  constructor(private httpClient: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.apiUrl);
  }
}