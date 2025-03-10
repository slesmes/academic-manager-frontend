export enum EnrollmentStatus {
    ENROLLED = 'ENROLLED',
    COMPLETED = 'COMPLETED',
    WITHDRAWN = 'WITHDRAWN',
    FAILED = 'FAILED'
}

export interface Enrollment {
    id: number;
    finalGrade?: number;
    enrollmentDate: string;
    status: EnrollmentStatus;
    student_id: string;
    group_id: number;
}

export interface CreateEnrollment {
    student_id: string;
    group_id: number;
}

export interface Evaluation {
    id: number;
    grade: number;
    date: string;
    type_id: number;
    enrollment_id: number;
}

export interface EvaluationType {
    id: number;
    name: string;
    percentage: number;
} 