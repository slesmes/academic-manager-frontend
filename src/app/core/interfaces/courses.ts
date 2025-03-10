import { Professor } from './professors';
import { Student } from './students';
import { Schedule } from './schedule';

export interface Course {
    id: number;
    name: string;
    description?: string;
    professor: Professor;
    groups: CourseGroup[];
    prerequisites?: Course[];
    code: string; // Código único del curso
}

export interface CourseGroup {
    id: number;
    name: string;
    capacity: number;
    semester: string;
    year: number;
    isActive: boolean;
    course: Course;
    schedules: Schedule[];
    enrollments: any[]; // Podemos crear una interfaz Enrollment si es necesario
}

export interface CreateCourseDto {
    name: string;
    description?: string;
    professorId: string;
    code: string;
    prerequisites?: number[]; // IDs de los cursos prerequisitos
}

export interface UpdateCourseDto {
    name?: string;
    description?: string;
    professorId?: string;
    code?: string;
    prerequisites?: number[];
}

export interface CreateCourseGroupDto {
    name: string;
    capacity: number;
    semester: string;
    year: number;
    courseId: number;
    schedules?: CreateScheduleDto[];
}

export interface CreateScheduleDto {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    classroom: string;
}

export interface Prerequisite {
    id: number;
    courseId: number;
    prerequisiteId: number;
    prerequisiteCourse: Course;
}