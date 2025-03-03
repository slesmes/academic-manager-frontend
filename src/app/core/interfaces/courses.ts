export interface Course {
    id: string;
    name: string;
    description: string;
    professor?: string;
    schedule?: string;
    prerequisites?: string;
}