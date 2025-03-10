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
    startTime: string;  // Formato HH:mm
    endTime: string;    // Formato HH:mm
    weekDay: WeekDay;
    classroom: string;
    startDate: string;  // Formato YYYY-MM-DD
    endDate: string;    // Formato YYYY-MM-DD
    group_id: number;
}

export interface CreateSchedule {
    startTime: string;
    endTime: string;
    weekDay: WeekDay;
    classroom: string;
    startDate: string;
    endDate: string;
    groupId: number;
}