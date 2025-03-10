import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupsService } from '../../core/services/course-groups.service';
import { Schedule, WeekDay } from '../../core/interfaces/schedule';

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
    schedules: Schedule[] = [];
    mostrarFormulario: boolean = false;
    errorMessage: string = '';
    weekDays: WeekDay[] = [WeekDay.MONDAY, WeekDay.TUESDAY, WeekDay.WEDNESDAY, WeekDay.THURSDAY, WeekDay.FRIDAY, WeekDay.SATURDAY];

    nuevoHorario: ScheduleForm = {
        startTime: '14:00:00',
        endTime: '16:00:00',
        weekDay: WeekDay.MONDAY,
        classroom: '',
        startDate: '',
        endDate: ''
    };

    constructor(
        private route: ActivatedRoute,
        private groupsService: CourseGroupsService
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

            this.cargarHorarios();
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

    cargarHorarios() {
        this.groupsService.getSchedulesByGroup(this.groupId).subscribe({
            next: (schedules) => {
                this.schedules = schedules;
                console.log('Horarios cargados:', this.schedules);
            },
            error: (err) => {
                console.error('Error al cargar horarios:', err);
                this.errorMessage = 'Error al cargar los horarios';
            }
        });
    }

    crearHorario() {
        if (!this.validarHorario()) {
            return;
        }

        const fechaBase = new Date();
        const [horaInicio, minutoInicio] = this.nuevoHorario.startTime.split(':');
        const [horaFin, minutoFin] = this.nuevoHorario.endTime.split(':');
        
        const startTime = new Date(fechaBase);
        startTime.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0);
        
        const endTime = new Date(fechaBase);
        endTime.setHours(parseInt(horaFin), parseInt(minutoFin), 0);

        const horarioDTO = {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            weekDay: this.nuevoHorario.weekDay,
            classroom: this.nuevoHorario.classroom,
            startDate: new Date(this.nuevoHorario.startDate).toISOString(),
            endDate: new Date(this.nuevoHorario.endDate).toISOString(),
            groupId: this.groupId
        };

        console.log('Creando horario:', horarioDTO);
        this.groupsService.createSchedule(horarioDTO).subscribe({
            next: () => {
                console.log('Horario creado exitosamente');
                this.cargarHorarios();
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
            this.errorMessage = 'El salón es requerido';
            return false;
        }
        if (!this.nuevoHorario.startDate || !this.nuevoHorario.endDate) {
            this.errorMessage = 'Las fechas de inicio y fin son requeridas';
            return false;
        }
        return true;
    }

    private resetNuevoHorario() {
        this.nuevoHorario = {
            startTime: '14:00:00',
            endTime: '16:00:00',
            weekDay: WeekDay.MONDAY,
            classroom: '',
            startDate: '',
            endDate: ''
        };
        this.errorMessage = '';
    }
} 