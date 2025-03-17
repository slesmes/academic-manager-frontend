export interface Evaluation {
    id: number;
    finalGrade: number;
    date: Date;
    typeEvaluation: TypeEvaluation;
    enrollment: {
        id: number;
        student: {
            id: number;
            name: string;
        };
    };
}

export interface TypeEvaluation {
    id: number;
    name: string;
    percentage: number;
}

export interface CreateEvaluationDto {
    finalGrade: number;
    date: Date;
    typeEvaluationId: number;
    enrollmentId: number;
}

export interface CreateTypeEvaluationDto {
    name: string;
    percentage: number;
    courseId?: number;
} 