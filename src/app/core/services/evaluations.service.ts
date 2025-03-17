import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation, CreateEvaluationDto, TypeEvaluation, CreateTypeEvaluationDto } from '../interfaces/evaluation';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EvaluationsService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    // Evaluaciones
    getEvaluationsByCourse(courseId: number): Observable<Evaluation[]> {
        return this.http.get<Evaluation[]>(`${this.apiUrl}/evaluations/course/${courseId}`);
    }

    createEvaluation(evaluation: CreateEvaluationDto): Observable<Evaluation> {
        return this.http.post<Evaluation>(`${this.apiUrl}/evaluations`, evaluation);
    }

    updateEvaluation(id: number, evaluation: Partial<CreateEvaluationDto>): Observable<Evaluation> {
        return this.http.patch<Evaluation>(`${this.apiUrl}/evaluations/${id}`, evaluation);
    }

    deleteEvaluation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/evaluations/${id}`);
    }

    // Tipos de Evaluación
    getTypeEvaluations(): Observable<TypeEvaluation[]> {
        return this.http.get<TypeEvaluation[]>(`${this.apiUrl}/type-evaluations`);
    }

    createTypeEvaluation(typeEvaluation: CreateTypeEvaluationDto): Observable<TypeEvaluation> {
        return this.http.post<TypeEvaluation>(`${this.apiUrl}/type-evaluations`, typeEvaluation);
    }

    updateTypeEvaluation(id: number, typeEvaluation: Partial<CreateTypeEvaluationDto>): Observable<TypeEvaluation> {
        return this.http.patch<TypeEvaluation>(`${this.apiUrl}/type-evaluations/${id}`, typeEvaluation);
    }

    deleteTypeEvaluation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/type-evaluations/${id}`);
    }
} 