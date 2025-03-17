export enum WeekDay {
    MONDAY = 'LUNES',
    TUESDAY = 'MARTES',
    WEDNESDAY = 'MIERCOLES',
    THURSDAY = 'JUEVES',
    FRIDAY = 'VIERNES',
    SATURDAY = 'SABADO',
    SUNDAY = 'DOMINGO'
}

export interface Schedule {
    id: number;
    startTime: Date;
    endTime: Date;
    weekDay: string;
    classroom: string;
    classDate: Date;
    group: any; 
}

export interface CreateScheduleDto {
    startTime: string;  
    endTime: string;    
    weekDay: string;    
    classroom: string;
    classDate: string;  
    groupId: number;
}

export interface ScheduleForm {
    classDate: string;   
    startTime: string;   
    endTime: string;    
    weekDay: string;
    classroom: string;
}

export interface UpdateScheduleDto {
    startTime?: string;
    endTime?: string;
    weekDay?: WeekDay;
    classroom?: string;
    classDate?: Date;
}