import { Professor } from './professors';
import { Student } from './students';

export interface Course {
    id: number;
    name: string;
    description: string;
    professor: Professor;
}

export interface CreateCourse {
    name: string;
    description: string;
    professorId: string;
}

export interface Schedule {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    courseId: number;
}

export interface Prerequisite {
    id: number;
    courseId: number;
    prerequisiteId: number;
    prerequisiteCourse: Course;
}