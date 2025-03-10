import { Department } from './departments';

export interface ProfessorData {
    id: string;
    hireDate: string;
    department: Department;
}

export interface Professor {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    role: string;
    professor?: ProfessorData;
}

export interface ProfessorDataDto {
    hireDate: string;
    departmentId: number;
}

export interface CreateProfessorDto {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    professor: ProfessorDataDto;
}

export interface UpdateProfessorDto {
    name?: string;
    email?: string;
    professor?: ProfessorDataDto;
}