import { Professor } from './professors';

export interface Department {
  codigo: string;
  nombre: string;
  profesores?: Professor["id"][];
}