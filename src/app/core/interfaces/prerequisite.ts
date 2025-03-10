import { Course } from './courses';

export interface Prerequisite {
    id: number;
    actual_course_id: number;
    prerequisite_course_id: number;
    prerequisiteCourse?: Course;
}