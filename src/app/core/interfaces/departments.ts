import { Professor } from './professors';

export interface Department {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
}

export interface DepartmentDto {

    name: string;
    description: string;
}