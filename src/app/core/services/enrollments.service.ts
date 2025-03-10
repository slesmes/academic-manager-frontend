import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'})

export class EnrollmentsService {
    apiUrl = 'http://localhost:3000/';
    constructor(private httpClient: HttpClient) { }
}
