import { Course } from "./courses";

export interface Prerequisite {
    id: number;
    actualCourse: Course;
    prerequisiteCourse: Course;
}