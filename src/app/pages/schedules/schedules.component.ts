import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupsService } from '../../core/services/course-groups.service';
import { Schedule, WeekDay, CreateScheduleDto, ScheduleForm } from '../../core/interfaces/schedule';
import { CoursesService } from '../../core/services/courses.service';
import { TimeFormatPipe } from '../../time-format.pipe';

@Component({
    selector: 'app-schedules',
    templateUrl: './schedules.component.html',
    styleUrl: './schedules.component.scss',
    imports: [CommonModule, FormsModule, RouterModule, TimeFormatPipe],
    standalone: true
})
export class SchedulesComponent implements OnInit {
    courseId: number = 0;
    groupId: number = 0;
    horarios: Schedule[] = [];
    mostrarFormulario: boolean = false;
    errorMessage: string = '';
    weekDays = Object.values(WeekDay);
    today: string = new Date().toISOString().split('T')[0];

    nuevoHorario: ScheduleForm = {
        classDate: '',          // Inicializar vacío
        startTime: '09:00',     // Hora por defecto
        endTime: '11:00',       // Hora por defecto
        weekDay: 'LUNES',
        classroom: ''
    };

    constructor(
        private route: ActivatedRoute,
        private groupsService: CourseGroupsService,
        private coursesService: CoursesService
    ) { }

    ngOnInit(): void {
        console.log('SchedulesComponent inicializado');
        this.setToday(); // Inicializar la fecha actual

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

    private setToday(): void {
        const now = new Date();
        this.today = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
                this.horarios = schedules.map(horario => ({
                    ...horario,
                    startTime: new Date(horario.startTime),
                    endTime: new Date(horario.endTime)
                }));
            },
            error: (error) => {
                console.error('Error loading schedules:', error);
            }
        });
    }

    private padTime(time: string): string {
        return time.split(':').map(t => t.padStart(2, '0')).join(':');
    }

    crearHorario() {
        if (!this.validarHorario()) return;

        // Construir fechas-hora combinadas
        const startDateTime = `${this.nuevoHorario.classDate}T${this.padTime(this.nuevoHorario.startTime)}:00`;
        const endDateTime = `${this.nuevoHorario.classDate}T${this.padTime(this.nuevoHorario.endTime)}:00`;

        const horarioDTO: CreateScheduleDto = {
            startTime: startDateTime,
            endTime: endDateTime,
            weekDay: this.nuevoHorario.weekDay,
            classroom: this.nuevoHorario.classroom,
            classDate: this.nuevoHorario.classDate, // Ya está en formato YYYY-MM-DD
            groupId: this.groupId
        };

        console.log('Enviando:', horarioDTO);

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
        return !!this.nuevoHorario.classDate && 
               !!this.nuevoHorario.startTime && 
               !!this.nuevoHorario.endTime && 
               !!this.nuevoHorario.classroom;
    }

    private resetNuevoHorario() {
        this.nuevoHorario = {
            classDate: '',
            startTime: '09:00',
            endTime: '11:00',
            weekDay: 'LUNES',
            classroom: ''
        };
    }
}