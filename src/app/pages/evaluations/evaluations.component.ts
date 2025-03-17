import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvaluationsService } from '../../core/services/evaluations.service';
import { TypeEvaluationService } from '../../core/services/type-evaluation.service';
import { CoursesService } from '../../core/services/courses.service';
import { AuthService } from '../../core/services/auth.service';
import { Course } from '../../core/interfaces/courses';
import { Evaluation, TypeEvaluation, CreateEvaluationDto, CreateTypeEvaluationDto } from '../../core/interfaces/evaluation';
import { Router } from '@angular/router';

@Component({
    selector: 'app-evaluations',
    templateUrl: './evaluations.component.html',
    styleUrl: './evaluations.component.scss',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    standalone: true
})
export class EvaluationsComponent implements OnInit {
    courses: Course[] = [];
    selectedCourse: Course | null = null;
    evaluations: Evaluation[] = [];
    typeEvaluations: TypeEvaluation[] = [];
    errorMessage: string = '';
    showEvaluationForm: boolean = false;
    showTypeEvaluationForm: boolean = false;
    showEditEvaluationForm: boolean = false;
    showViewEvaluationsModal: boolean = false;
    selectedTypeEvaluation: TypeEvaluation | null = null;
    typeEvaluationDetails: any = null;
    userInfo: any;

    newEvaluation: CreateEvaluationDto = {
        finalGrade: 0,
        date: new Date(),
        typeEvaluationId: 0,
        enrollmentId: 0
    };

    editingEvaluation: CreateEvaluationDto = {
        finalGrade: 0,
        date: new Date(),
        typeEvaluationId: 0,
        enrollmentId: 0
    };

    newTypeEvaluation: CreateTypeEvaluationDto = {
        name: '',
        percentage: 0
    };

    constructor(
        private evaluationsService: EvaluationsService,
        private typeEvaluationService: TypeEvaluationService,
        private coursesService: CoursesService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCourses();
    }

    loadCourses(): void {
        const userInfo = this.authService.getUserInfo();
        
        if (!userInfo) {
            console.error('No se pudo obtener la información del usuario');
            this.router.navigate(['/login']);
            return;
        }

        const { role, sub: userId } = userInfo;

        if (role === 'admin') {
            this.coursesService.getCourses().subscribe({
                next: (courses: Course[]) => {
                    console.log('Cursos cargados:', courses);
                    this.courses = courses;
                },
                error: (error) => {
                    console.error('Error al cargar los cursos:', error);
                    this.handleError(error);
                }
            });
        } else if (role === 'professor') {
            this.coursesService.getCoursesByProfessor(userId).subscribe({
                next: (courses: Course[]) => {
                    console.log('Cursos del profesor cargados:', courses);
                    this.courses = courses;
                },
                error: (error) => {
                    console.error('Error al cargar los cursos del profesor:', error);
                    this.handleError(error);
                }
            });
        } else {
            console.error('Rol de usuario no válido:', role);
            this.errorMessage = 'No tiene permisos para ver los cursos';
        }
    }

    onCourseSelect(courseId: number): void {
        if (courseId) {
            this.coursesService.getCourseById(courseId).subscribe({
                next: (course) => {
                    this.selectedCourse = course;
                    this.loadTypeEvaluations(courseId);
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.selectedCourse = null;
            this.typeEvaluations = [];
        }
    }

    loadTypeEvaluations(courseId: number): void {
        this.typeEvaluationService.getTypeEvaluationsByCourse(courseId).subscribe({
            next: (types) => this.typeEvaluations = types,
            error: (error) => this.handleError(error)
        });
    }

    createTypeEvaluation(): void {
        if (!this.selectedCourse) {
            this.errorMessage = 'Debe seleccionar un curso primero';
            return;
        }

        if (this.validateTypeEvaluation()) {
            const typeEvaluationDto = {
                ...this.newTypeEvaluation,
                courseId: Number(this.selectedCourse.id)
            };

            this.typeEvaluationService.createTypeEvaluation(typeEvaluationDto).subscribe({
                next: () => {
                    this.loadTypeEvaluations(this.selectedCourse!.id);
                    this.showTypeEvaluationForm = false;
                    this.resetNewTypeEvaluation();
                },
                error: (error) => {
                    console.error('Error creating type evaluation:', error);
                    this.handleError(error);
                }
            });
        }
    }

    viewTypeEvaluationDetails(typeEvaluation: TypeEvaluation): void {
        this.selectedTypeEvaluation = typeEvaluation;
        this.typeEvaluationService.getTypeEvaluationDetails(typeEvaluation.id).subscribe({
            next: (details) => {
                this.typeEvaluationDetails = details;
                this.showViewEvaluationsModal = true;
            },
            error: (error) => this.handleError(error)
        });
    }

    loadEvaluations(courseId: number): void {
        this.evaluationsService.getEvaluationsByCourse(courseId).subscribe({
            next: (evaluations) => this.evaluations = evaluations,
            error: (error) => this.handleError(error)
        });
    }

    createEvaluation(): void {
        if (this.validateEvaluation()) {
            this.evaluationsService.createEvaluation(this.newEvaluation).subscribe({
                next: () => {
                    if (this.selectedCourse) {
                        this.loadEvaluations(this.selectedCourse.id);
                    }
                    this.showEvaluationForm = false;
                    this.resetNewEvaluation();
                },
                error: (error) => this.handleError(error)
            });
        }
    }

    deleteTypeEvaluation(id: number): void {
        if (confirm('¿Está seguro de eliminar este tipo de evaluación?')) {
            this.typeEvaluationService.deleteTypeEvaluation(id).subscribe({
                next: () => {
                    this.loadTypeEvaluations(this.selectedCourse!.id);
                },
                error: (error) => this.handleError(error)
            });
        }
    }

    openAddEvaluationModal(typeEvaluation: TypeEvaluation): void {
        this.selectedTypeEvaluation = typeEvaluation;
        this.newEvaluation.typeEvaluationId = typeEvaluation.id;
        this.showEvaluationForm = true;
    }

    openEditEvaluationModal(evaluation: Evaluation): void {
        this.editingEvaluation = {
            finalGrade: evaluation.finalGrade,
            date: new Date(evaluation.date),
            typeEvaluationId: evaluation.typeEvaluation.id,
            enrollmentId: evaluation.enrollment.id
        };
        this.showEditEvaluationForm = true;
    }

    updateEvaluation(): void {
        if (this.validateEvaluation()) {
            this.evaluationsService.updateEvaluation(this.editingEvaluation.typeEvaluationId, this.editingEvaluation).subscribe({
                next: () => {
                    if (this.selectedCourse) {
                        this.loadEvaluations(this.selectedCourse.id);
                    }
                    this.showEditEvaluationForm = false;
                },
                error: (error) => this.handleError(error)
            });
        }
    }

    private validateEvaluation(): boolean {
        if (this.newEvaluation.finalGrade < 0 || this.newEvaluation.finalGrade > 5) {
            this.errorMessage = 'La calificación debe estar entre 0 y 5';
            return false;
        }
        if (!this.newEvaluation.typeEvaluationId) {
            this.errorMessage = 'Debe seleccionar un tipo de evaluación';
            return false;
        }
        if (!this.newEvaluation.enrollmentId) {
            this.errorMessage = 'Debe seleccionar un estudiante';
            return false;
        }
        return true;
    }

    private validateTypeEvaluation(): boolean {
        if (!this.newTypeEvaluation.name.trim()) {
            this.errorMessage = 'El nombre del tipo de evaluación es requerido';
            return false;
        }
        if (this.newTypeEvaluation.percentage <= 0 || this.newTypeEvaluation.percentage > 100) {
            this.errorMessage = 'El porcentaje debe estar entre 1 y 100';
            return false;
        }
        return true;
    }

    private resetNewEvaluation(): void {
        this.newEvaluation = {
            finalGrade: 0,
            date: new Date(),
            typeEvaluationId: 0,
            enrollmentId: 0
        };
        this.errorMessage = '';
    }

    private resetNewTypeEvaluation(): void {
        this.newTypeEvaluation = {
            name: '',
            percentage: 0
        };
        this.errorMessage = '';
    }

    private handleError(error: any): void {
        console.error('Error:', error);
        if (error.status === 401) {
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
        }
        this.errorMessage = error.error?.message || 'Ha ocurrido un error';
    }
}
