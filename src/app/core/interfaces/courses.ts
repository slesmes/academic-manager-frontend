import { Professor } from "./professors";

export interface Course {
    id: number;
    name: string;
    description: string;
    professor?: Professor;
}

export interface CreateCourse {
    name: string;
    description: string;
    professorId: string;
}