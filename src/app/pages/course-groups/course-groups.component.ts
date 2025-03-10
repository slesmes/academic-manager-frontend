import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupsService } from '../../core/services/course-groups.service';
import { CoursesService } from '../../core/services/courses.service';
import { CourseGroup, Course } from '../../core/interfaces/courses';
import { Schedule, WeekDay, CreateScheduleDto } from '../../core/interfaces/schedule';
import { HttpErrorResponse } from '@angular/common/http';

interface CreateGroupDTO {
    name: string;
    capacity: number;
    semester: string;
    year: number;
    courseId: number;
}

@Component({
    selector: 'app-course-groups',
    templateUrl: './course-groups.component.html',
    styleUrl: './course-groups.component.scss',
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
    standalone: true
})
export class CourseGroupsComponent implements OnInit {
    courseId: number = 0;
    course: Course | null = null;
    groups: CourseGroup[] = [];
    schedules: { [key: number]: Schedule[] } = {};
    mostrarFormulario: boolean = false;
    errorMessage: string = '';
    currentYear: number = new Date().getFullYear();
    semesters: string[] = [`${this.currentYear}-1`, `${this.currentYear}-2`];
    showGroupForm: boolean = false;
    showScheduleForm: boolean = false;
    courses: Course[] = [];
    selectedCourse: Course | null = null;
    selectedGroupId: number | null = null;
    weekDays = Object.values(WeekDay);

    nuevoGrupo: CreateGroupDTO = {
        name: '',
        capacity: 0,
        semester: `${this.currentYear}-1`,
        year: this.currentYear,
        courseId: 0
    };

    groupForm: FormGroup;
    scheduleForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private groupsService: CourseGroupsService,
        private coursesService: CoursesService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.groupForm = this.initializeGroupForm();
        this.scheduleForm = this.initializeScheduleForm();
    }

    private handleError(error: HttpErrorResponse): void {
        console.error('Error:', error);
        if (error.status === 401) {
            console.log('Redirigiendo al login por error de autorización');
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
        } else {
            console.error('Error en la operación:', error);
            window.alert(error.error?.message || 'Error desconocido');
        }
    }

    private initializeGroupForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(10)]],
            capacity: ['', [Validators.required, Validators.min(1)]],
            semester: ['', [Validators.required]],
            year: ['', [Validators.required, Validators.min(2000)]],
            isActive: [true]
        });
    }

    private initializeScheduleForm(): FormGroup {
        return this.fb.group({
            weekDay: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            classroom: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        console.log('CourseGroupsComponent inicializado');
        
        this.route.params.subscribe(params => {
            console.log('Parámetros recibidos:', params);
            
            this.courseId = +params['courseId'];
            console.log('ID del curso extraído:', this.courseId);
            
            if (!this.courseId) {
                console.error('ID de curso inválido');
                this.errorMessage = 'ID de curso inválido';
                return;
            }

            this.nuevoGrupo.courseId = this.courseId;
            this.cargarCurso();
        });
    }

    cargarCurso() {
        this.coursesService.getCourseById(this.courseId).subscribe({
            next: (course) => {
                this.course = course;
                this.selectedCourse = course;
                this.cargarGrupos();
            },
            error: (err) => {
                console.error('Error al cargar el curso:', err);
                this.errorMessage = 'Error al cargar el curso';
            }
        });
    }

    cargarGrupos() {
        if (!this.course || !this.course.id) {
            console.error('No hay curso seleccionado o el ID del curso es inválido');
            this.errorMessage = 'Error: No se pudo cargar los grupos del curso';
            return;
        }
        
        this.groupsService.getGroupsByCourse(this.course.id).subscribe({
            next: (groups) => {
                this.groups = groups.map(group => ({
                    ...group,
                    course: this.course!,
                    schedules: [],
                    enrollments: []
                }));
                this.groups.forEach(group => this.loadSchedules(this.course!.id, group.id));
            },
            error: (err) => {
                console.error('Error al cargar grupos:', err);
                if (err.status === 401) {
                    console.log('Error de autorización, redirigiendo al login');
                    localStorage.removeItem('access_token');
                    this.router.navigate(['/login']);
                } else {
                    this.errorMessage = 'Error al cargar los grupos';
                }
            }
        });
    }

    loadSchedules(courseId: number, groupId: number): void {
        this.coursesService.getGroupSchedules(courseId, groupId).subscribe({
            next: (schedules) => {
                this.schedules[groupId] = schedules;
            },
            error: (error) => this.handleError(error)
        });
    }

    crearGrupo() {
        if (!this.validarGrupo()) {
            return;
        }

        this.nuevoGrupo.courseId = this.courseId;
        this.groupsService.createGroup(this.nuevoGrupo).subscribe({
            next: () => {
                this.cargarGrupos();
                this.mostrarFormulario = false;
                this.resetNuevoGrupo();
            },
            error: (err) => {
                console.error('Error al crear grupo:', err);
                if (err.error && err.error.message) {
                    this.errorMessage = Array.isArray(err.error.message) 
                        ? err.error.message.join(', ') 
                        : err.error.message;
                } else {
                    this.errorMessage = 'Error al crear el grupo';
                }
            }
        });
    }

    eliminarGrupo(id: number) {
        // if (confirm('¿Está seguro de eliminar este grupo?')) {
        //     this.groupsService.deleteGroup(id).subscribe({
        //         next: () => {
        //             this.cargarGrupos();
        //         },
        //         error: (err) => {
        //             console.error('Error al eliminar grupo:', err);
        //             this.errorMessage = 'Error al eliminar el grupo';
        //         }
        //     });
        // }
    }

    toggleEstadoGrupo(group: CourseGroup) {
        // this.groupsService.updateGroup(group.id, { isActive: !group.isActive }).subscribe({
        //     next: () => {
        //         this.cargarGrupos();
        //     },
        //     error: (err) => {
        //         console.error('Error al actualizar estado del grupo:', err);
        //         this.errorMessage = 'Error al actualizar el estado del grupo';
        //     }
        // });
    }

    private validarGrupo(): boolean {
        if (!this.nuevoGrupo.name.trim()) {
            this.errorMessage = 'El nombre del grupo es requerido';
            return false;
        }
        if (this.nuevoGrupo.capacity <= 0) {
            this.errorMessage = 'La capacidad debe ser mayor a 0';
            return false;
        }
        return true;
    }

    private resetNuevoGrupo() {
        this.nuevoGrupo = {
            name: '',
            capacity: 0,
            semester: `${this.currentYear}-1`,
            year: this.currentYear,
            courseId: this.courseId
        };
        this.errorMessage = '';
    }

    irAGestionarHorarios(groupId: number) {
        console.log('Intentando navegar a horarios del grupo:', groupId);
        this.router.navigate(['/course-groups', this.courseId, groupId, 'schedules'])
            .then(() => {
                console.log('Navegación exitosa a horarios');
            })
            .catch(err => {
                console.error('Error al navegar:', err);
                this.errorMessage = 'Error al navegar a la gestión de horarios';
            });
    }

    createGroup(): void {
        if (this.groupForm.valid && this.course) {
            const groupData: CreateGroupDTO = {
                name: this.groupForm.value.name.trim(),
                capacity: Number(this.groupForm.value.capacity),
                semester: this.groupForm.value.semester,
                year: Number(this.groupForm.value.year),
                courseId: this.course.id
            };

            this.coursesService.createCourseGroup(this.course.id, groupData).subscribe({
                next: (group) => {
                    this.groups.push(group);
                    this.showGroupForm = false;
                    this.groupForm.reset();
                    window.alert('Grupo creado exitosamente');
                },
                error: (error) => this.handleError(error)
            });
        }
    }

    addSchedule(): void {
        if (this.scheduleForm.valid && this.course && this.selectedGroupId !== null) {
            const formValue = this.scheduleForm.value;
            const scheduleData: CreateScheduleDto = {
                startTime: formValue.startTime,
                endTime: formValue.endTime,
                weekDay: formValue.weekDay as WeekDay,
                classroom: formValue.classroom.trim(),
                startDate: formValue.startDate,
                endDate: formValue.endDate,
                groupId: this.selectedGroupId
            };

            this.coursesService.addScheduleToGroup(
                this.course.id,
                this.selectedGroupId,
                scheduleData
            ).subscribe({
                next: (schedule) => {
                    if (!this.schedules[this.selectedGroupId!]) {
                        this.schedules[this.selectedGroupId!] = [];
                    }
                    this.schedules[this.selectedGroupId!].push(schedule);
                    this.showScheduleForm = false;
                    this.scheduleForm.reset();
                    window.alert('Horario agregado exitosamente');
                },
                error: (error) => this.handleError(error)
            });
        }
    }

    openScheduleForm(groupId: number): void {
        this.selectedGroupId = groupId;
        this.showScheduleForm = true;
    }

    onCourseSelect(courseId: string): void {
        if (courseId) {
            this.coursesService.getCourseById(parseInt(courseId)).subscribe({
                next: (course) => {
                    this.selectedCourse = course;
                    this.cargarGrupos();
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.selectedCourse = null;
        }
    }
} 