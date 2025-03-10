import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseGroup, CreateCourseGroup } from '../interfaces/course-groups';
import { Schedule, CreateSchedule } from '../interfaces/schedule';
import { environment } from '../../../environments/environment';

interface CreateGroupDTO {
    name: string;
    capacity: number;
    semester: string;
    year: number;
    courseId: number;
}

@Injectable({
    providedIn: 'root'
})
export class CourseGroupsService {
    private apiUrlCourseGroups = `${environment.apiUrl}/course-groups`;
    private scheduleUrl = `${environment.apiUrl}/schedules`;

    constructor(private http: HttpClient) { }

    // Grupos
    getGroups(): Observable<CourseGroup[]> {
        return this.http.get<CourseGroup[]>(this.apiUrlCourseGroups);
    }

    getGroupById(id: number): Observable<CourseGroup> {
        return this.http.get<CourseGroup>(`${this.apiUrlCourseGroups}/${id}`);
    }

    getGroupsByCourse(courseId: number): Observable<CourseGroup[]> {
        return this.http.get<CourseGroup[]>(`${this.apiUrlCourseGroups}/course/${courseId}`);
    }

    createGroup(group: CreateGroupDTO): Observable<CourseGroup> {
        return this.http.post<CourseGroup>(this.apiUrlCourseGroups, group);
    }

    // updateGroup(id: number, group: Partial<CourseGroup>): Observable<CourseGroup> {
    //     return this.http.patch<CourseGroup>(`${this.apiUrl}/${id}`, group);
    // }

    // deleteGroup(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // Horarios
    getSchedules(): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(this.scheduleUrl);
    }

    getScheduleById(id: number): Observable<Schedule> {
        return this.http.get<Schedule>(`${this.scheduleUrl}/${id}`);
    }

    getSchedulesByGroup(groupId: number): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(`${this.scheduleUrl}/group/${groupId}`);
    }

    createSchedule(schedule: CreateSchedule): Observable<Schedule> {
        return this.http.post<Schedule>(this.scheduleUrl, schedule);
    }

    updateSchedule(id: number, schedule: Partial<Schedule>): Observable<Schedule> {
        return this.http.patch<Schedule>(`${this.scheduleUrl}/${id}`, schedule);
    }

    deleteSchedule(id: number): Observable<void> {
        return this.http.delete<void>(`${this.scheduleUrl}/${id}`);
    }
} 