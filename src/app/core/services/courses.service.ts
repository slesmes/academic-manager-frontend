import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Course, CreateCourseDto, UpdateCourseDto, CourseGroup, CreateCourseGroupDto } from '../interfaces/courses';
import { Schedule, CreateScheduleDto } from '../interfaces/schedule';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private apiUrl = 'http://localhost:3000';
    private platformId = inject(PLATFORM_ID);
    private httpClient = inject(HttpClient);

    private getHeaders(): HttpHeaders {
        if (!isPlatformBrowser(this.platformId)) {
            return new HttpHeaders();
        }
        const token = localStorage.getItem('access_token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    // Cursos
    getCourses(): Observable<Course[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.httpClient.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getHeaders() });
    }

    getCourseById(id: number): Observable<Course> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({} as Course);
        }
        return this.httpClient.get<Course>(`${this.apiUrl}/courses/${id}`, { headers: this.getHeaders() });
    }

    createCourse(course: CreateCourseDto): Observable<Course> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({} as Course);
        }
        return this.httpClient.post<Course>(`${this.apiUrl}/courses`, course, { headers: this.getHeaders() });
    }

    updateCourse(id: number, course: UpdateCourseDto): Observable<Course> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({} as Course);
        }
        return this.httpClient.patch<Course>(`${this.apiUrl}/courses/${id}`, course, { headers: this.getHeaders() });
    }

    deleteCourse(id: number): Observable<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(void 0);
        }
        return this.httpClient.delete<void>(`${this.apiUrl}/courses/${id}`, { headers: this.getHeaders() });
    }

    // Prerequisitos
    getCoursePrerequisites(courseId: number): Observable<Course[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.httpClient.get<Course[]>(`${this.apiUrl}/courses/${courseId}/prerequisites`, { headers: this.getHeaders() });
    }

    addPrerequisite(courseId: number, prerequisiteId: number): Observable<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(void 0);
        }
        return this.httpClient.post<void>(
            `${this.apiUrl}/courses/${courseId}/prerequisites`,
            { prerequisiteId },
            { headers: this.getHeaders() }
        );
    }

    removePrerequisite(courseId: number, prerequisiteId: number): Observable<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(void 0);
        }
        return this.httpClient.delete<void>(
            `${this.apiUrl}/courses/${courseId}/prerequisites/${prerequisiteId}`,
            { headers: this.getHeaders() }
        );
    }

    // Grupos
    getCourseGroups(courseId: number): Observable<CourseGroup[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.httpClient.get<CourseGroup[]>(`${this.apiUrl}/courses/${courseId}/groups`, { headers: this.getHeaders() });
    }

    createCourseGroup(courseId: number, group: CreateCourseGroupDto): Observable<CourseGroup> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({} as CourseGroup);
        }
        return this.httpClient.post<CourseGroup>(
            `${this.apiUrl}/courses/${courseId}/groups`,
            group,
            { headers: this.getHeaders() }
        );
    }

    // Horarios
    getGroupSchedules(courseId: number, groupId: number): Observable<Schedule[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.httpClient.get<Schedule[]>(
            `${this.apiUrl}/courses/${courseId}/groups/${groupId}/schedules`,
            { headers: this.getHeaders() }
        );
    }

    addScheduleToGroup(courseId: number, groupId: number, schedule: CreateScheduleDto): Observable<Schedule> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({} as Schedule);
        }
        return this.httpClient.post<Schedule>(
            `${this.apiUrl}/courses/${courseId}/groups/${groupId}/schedules`,
            schedule,
            { headers: this.getHeaders() }
        );
    }
}