import { CourseGroup } from './courses';

export enum WeekDay {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface Schedule {
    id: number;
    startTime: Date;
    endTime: Date;
    weekDay: WeekDay;
    classroom: string;
    startDate: Date;
    endDate: Date;
    group: any; // CourseGroup reference
}

export interface CreateScheduleDto {
    startTime: string;
    endTime: string;
    weekDay: WeekDay;
    classroom: string;
    startDate: string;
    endDate: string;
    groupId: number;
}

export interface UpdateScheduleDto {
    startTime?: string;
    endTime?: string;
    weekDay?: WeekDay;
    classroom?: string;
    startDate?: string;
    endDate?: string;
}