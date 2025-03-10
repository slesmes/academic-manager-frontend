import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enrollment, CreateEnrollment, Evaluation, EvaluationType } from '../interfaces/enrollment';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentsService {
    private apiUrl = `${environment.apiUrl}/enrollments`;
    private evaluationsUrl = `${environment.apiUrl}/evaluations`;
    private evaluationTypesUrl = `${environment.apiUrl}/type-evaluations`;

    constructor(private http: HttpClient) { }

    // Inscripciones
    getEnrollments(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.apiUrl);
    }

    getEnrollmentById(id: number): Observable<Enrollment> {
        return this.http.get<Enrollment>(`${this.apiUrl}/${id}`);
    }

    getEnrollmentsByStudent(studentId: string): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}`);
    }

    getEnrollmentsByGroup(groupId: number): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/group/${groupId}`);
    }

    createEnrollment(enrollment: CreateEnrollment): Observable<Enrollment> {
        return this.http.post<Enrollment>(this.apiUrl, enrollment);
    }

    updateEnrollmentStatus(id: number, status: string): Observable<Enrollment> {
        return this.http.patch<Enrollment>(`${this.apiUrl}/${id}/status`, { status });
    }

    // Evaluaciones
    getEvaluationTypes(): Observable<EvaluationType[]> {
        return this.http.get<EvaluationType[]>(this.evaluationTypesUrl);
    }

    getEvaluationsByEnrollment(enrollmentId: number): Observable<Evaluation[]> {
        return this.http.get<Evaluation[]>(`${this.evaluationsUrl}/enrollment/${enrollmentId}`);
    }

    createEvaluation(evaluation: Omit<Evaluation, 'id'>): Observable<Evaluation> {
        return this.http.post<Evaluation>(this.evaluationsUrl, evaluation);
    }

    updateEvaluation(id: number, evaluation: Partial<Evaluation>): Observable<Evaluation> {
        return this.http.patch<Evaluation>(`${this.evaluationsUrl}/${id}`, evaluation);
    }

    deleteEvaluation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.evaluationsUrl}/${id}`);
    }
}
