export interface CourseGroup {
    id: number;
    name: string;
    capacity: number;
    semester: string;
    year: number;
    isActive: boolean;
    course_id: number;
}

export interface CreateCourseGroup {
    name: string;
    capacity: number;
    semester: string;
    year: number;
    isActive: boolean;
    course_id: number;
} 