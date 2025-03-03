import { Course } from './courses';

export interface student {
    id: string;
    nombre: string;
    fechaNacimiento: Date;
    cursos?: Course["id"][];
}