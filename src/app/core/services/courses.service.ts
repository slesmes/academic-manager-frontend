import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, CreateCourse } from '../interfaces/courses';
import { Schedule } from '../interfaces/schedule';
import { Prerequisite } from '../interfaces/prerequisite';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private apiUrl = `${environment.apiUrl}/courses`;

    constructor(private http: HttpClient) { }

    getCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(this.apiUrl);
    }

    getCourseById(id: number): Observable<Course> {
        return this.http.get<Course>(`${this.apiUrl}/${id}`);
    }

    createCourse(course: CreateCourse): Observable<Course> {
        return this.http.post<Course>(this.apiUrl, course);
    }

    updateCourse(id: number, course: Partial<Course>): Observable<Course> {
        return this.http.patch<Course>(`${this.apiUrl}/${id}`, course);
    }

    deleteCourse(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getPreRequisitesByCourseId(courseId: number): Observable<Prerequisite[]> {
        return this.http.get<Prerequisite[]>(`${this.apiUrl}/${courseId}/prerequisites`);
    }

    addPrerequisite(courseId: number, prerequisiteId: number): Observable<Prerequisite> {
        return this.http.post<Prerequisite>(`${this.apiUrl}/${courseId}/prerequisites`, { prerequisite_course_id: prerequisiteId });
    }

    removePrerequisite(courseId: number, prerequisiteId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${courseId}/prerequisites/${prerequisiteId}`);
    }
}