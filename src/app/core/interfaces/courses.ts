import { Professor } from './professors';
import { Student } from './students';

export interface Course {
    id: number;
    name: string;
    description: string;
    credits: number;
    code: string;
    professor?: {
        id: string;
        name: string;
        email: string;
        role: string;
        professor: {
            id: string;
            hireDate: string;
            department: {
                id: number;
                name: string;
                description: string;
            };
        };
    };
    students?: Student[];
}

export interface CreateCourse {
    name: string;
    description: string;
    credits: number;
    code: string;
    professorId?: string;
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