import { Professor } from './professors';

export interface Department {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    professorCount?: number;
}

export interface DepartmentDto {
    name: string;
    description: string;
}