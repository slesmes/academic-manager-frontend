import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEvaluation, CreateTypeEvaluationDto } from '../interfaces/evaluation';

@Injectable({
    providedIn: 'root'
})
export class TypeEvaluationService {
    private apiUrl = 'http://localhost:3000/type-evaluations';

    constructor(private http: HttpClient) { }

    getTypeEvaluationsByCourse(courseId: number): Observable<TypeEvaluation[]> {
        return this.http.get<TypeEvaluation[]>(`${this.apiUrl}/course/${courseId}`);
    }

    createTypeEvaluation(typeEvaluation: CreateTypeEvaluationDto & { courseId: number }): Observable<TypeEvaluation> {
        const payload = {
            ...typeEvaluation,
            courseId: Number(typeEvaluation.courseId)
        };
        return this.http.post<TypeEvaluation>(this.apiUrl, payload);
    }

    updateTypeEvaluation(id: number, typeEvaluation: Partial<CreateTypeEvaluationDto>): Observable<TypeEvaluation> {
        if ('courseId' in typeEvaluation) {
            typeEvaluation.courseId = Number(typeEvaluation.courseId);
        }
        return this.http.patch<TypeEvaluation>(`${this.apiUrl}/${id}`, typeEvaluation);
    }

    deleteTypeEvaluation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getTypeEvaluationDetails(typeEvaluationId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${typeEvaluationId}/details`);
    }
} 