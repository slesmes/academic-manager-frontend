import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourse } from '../interfaces/courses';
import { Prerequisite } from '../interfaces/prerequisite';
import { Schedule } from '../interfaces/schedule';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getPreRequisitesByCourseId(courseId: number): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.apiUrl}/prerequisites/course/${courseId}`);
  }

  getSchedulesByCourseId(courseId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/schedules/course/${courseId}`);
  }

  createCourse(course: CreateCourse): Observable<CreateCourse> {
    return this.http.post<CreateCourse>(`${this.apiUrl}/courses`, course);
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`);
  }
}