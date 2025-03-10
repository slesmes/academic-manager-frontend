import { Course } from './courses';

export interface StudentData {
    lastname: string;
    birthdate: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    role: string;
    student?: StudentData;
}

export interface StudentDataDto {
    lastname: string;
    birthdate: string;
}

export interface CreateStudentDto {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    student: StudentDataDto;
}

export interface UpdateStudentDto {
    name?: string;
    email?: string;
    student?: StudentDataDto;
}