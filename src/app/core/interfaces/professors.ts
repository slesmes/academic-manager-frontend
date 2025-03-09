import { Department } from "./departments";

export interface Professor {
    id: string;
    name: string;
    hireDate: Date;
    department: Department;
  }