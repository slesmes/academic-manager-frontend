import { Schedule } from './schedule';

export interface CourseGroup {
    id: number;
    name: string;
    capacity: number;
    semester: string;
    year: number;
    isActive: boolean;
    courseId: number;
    schedules: Schedule[];
}

export interface CreateCourseGroup {
    name: string;
    capacity: number;
    semester: string;
    year: number;
    courseId: number;
} 