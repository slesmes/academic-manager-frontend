import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupsService } from '../../core/services/course-groups.service';
import { Schedule, WeekDay, CreateScheduleDto } from '../../core/interfaces/schedule';
import { CoursesService } from '../../core/services/courses.service';

interface ScheduleForm {
    startTime: string;
    endTime: string;
    weekDay: WeekDay;
    classroom: string;
    startDate: string;
    endDate: string;
}

@Component({
    selector: 'app-schedules',
    templateUrl: './schedules.component.html',
    styleUrl: './schedules.component.scss',
    imports: [CommonModule, FormsModule, RouterModule],
    standalone: true
})
export class SchedulesComponent implements OnInit {
    courseId: number = 0;
    groupId: number = 0;
    horarios: Schedule[] = [];
    mostrarFormulario: boolean = false;
    errorMessage: string = '';
    weekDays = Object.values(WeekDay);

    nuevoHorario: ScheduleForm = {
        startTime: '',
        endTime: '',
        weekDay: WeekDay.MONDAY,
        classroom: '',
        startDate: '',
        endDate: ''
    };

    constructor(
        private route: ActivatedRoute,
        private groupsService: CourseGroupsService,
        private coursesService: CoursesService
    ) { }

    ngOnInit(): void {
        console.log('SchedulesComponent inicializado');
        
        this.route.params.subscribe(params => {
            console.log('Parámetros recibidos:', params);
            
            this.courseId = +params['courseId'];
            this.groupId = +params['groupId'];
            console.log('ID del curso:', this.courseId);
            console.log('ID del grupo:', this.groupId);
            
            if (!this.courseId || !this.groupId) {
                console.error('IDs inválidos');
                this.errorMessage = 'IDs inválidos';
                return;
            }

            this.loadSchedules();
        });
    }

    abrirModal() {
        console.log('Abriendo modal de crear horario');
        this.mostrarFormulario = true;
    }

    cerrarModal() {
        console.log('Cerrando modal de crear horario');
        this.mostrarFormulario = false;
        this.errorMessage = '';
    }

    loadSchedules(): void {
        this.coursesService.getGroupSchedules(this.courseId, this.groupId).subscribe({
            next: (schedules) => {
                this.horarios = schedules;
            },
            error: (error) => {
                console.error('Error loading schedules:', error);
            }
        });
    }

    crearHorario() {
        if (!this.validarHorario()) {
            return;
        }

        const horarioDTO: CreateScheduleDto = {
            startTime: this.nuevoHorario.startTime,
            endTime: this.nuevoHorario.endTime,
            weekDay: this.nuevoHorario.weekDay,
            classroom: this.nuevoHorario.classroom,
            startDate: this.nuevoHorario.startDate,
            endDate: this.nuevoHorario.endDate,
            groupId: this.groupId
        };

        console.log('Creando horario:', horarioDTO);
        this.groupsService.createSchedule(horarioDTO).subscribe({
            next: () => {
                console.log('Horario creado exitosamente');
                this.loadSchedules();
                this.cerrarModal();
                this.resetNuevoHorario();
            },
            error: (err) => {
                console.error('Error al crear horario:', err);
                if (err.error && err.error.message) {
                    this.errorMessage = Array.isArray(err.error.message) 
                        ? err.error.message.join(', ') 
                        : err.error.message;
                } else {
                    this.errorMessage = 'Error al crear el horario';
                }
            }
        });
    }

    private validarHorario(): boolean {
        if (!this.nuevoHorario.classroom.trim()) {
            this.errorMessage = 'El aula es requerida';
            return false;
        }
        if (!this.nuevoHorario.startDate || !this.nuevoHorario.endDate) {
            this.errorMessage = 'Las fechas de inicio y fin son requeridas';
            return false;
        }
        if (!this.nuevoHorario.startTime || !this.nuevoHorario.endTime) {
            this.errorMessage = 'Las horas de inicio y fin son requeridas';
            return false;
        }
        return true;
    }

    private resetNuevoHorario() {
        this.nuevoHorario = {
            startTime: '',
            endTime: '',
            weekDay: WeekDay.MONDAY,
            classroom: '',
            startDate: '',
            endDate: ''
        };
        this.errorMessage = '';
    }
} 