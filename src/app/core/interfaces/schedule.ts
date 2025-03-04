export interface Schedule {
    id: number;
    courseId: number;
    weekDay: string;
    start: Date;
    end: Date;
}