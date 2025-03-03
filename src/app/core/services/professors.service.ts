import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'})

export class ProfessorsService {
    apiUrl = 'http://localhost:3000/professors';
    constructor(private httpClient: HttpClient) { }
}
