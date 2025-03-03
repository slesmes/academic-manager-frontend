import { Department } from "./departments";

export interface Professor {
    id: number;
    name: string;
    hiredate: Date;
    departamento?: Department["name"];
  }