import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CourseGroupsService } from '../../core/services/course-groups.service';
import { CoursesService } from '../../core/services/courses.service';
import { Course } from '../../core/interfaces/courses';
import { CourseGroup, CreateCourseGroup } from '../../core/interfaces/course-groups';
import { CreateScheduleDto, Schedule, WeekDay } from '../../core/interfaces/schedule';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeFormatPipe } from '../../time-format.pipe';

@Component({
    selector: 'app-course-groups',
    templateUrl: './course-groups.component.html',
    styleUrl: './course-groups.component.scss',
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, TimeFormatPipe],
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

    nuevoGrupo: CreateCourseGroup = {
        name: '',
        capacity: 30,
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
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            weekDay: ['', Validators.required],
            classroom: ['', Validators.required],
            classDate: ['', Validators.required]
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
                    schedules: group.schedules?.map(schedule => ({
                        ...schedule,
                        startTime: new Date(schedule.startTime), 
                        endTime: new Date(schedule.endTime)      
                    }))
                }));
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
        if (this.nuevoGrupo.name.length > 10) {
            this.errorMessage = 'El nombre del grupo no puede exceder los 10 caracteres';
            return false;
        }
        if (this.nuevoGrupo.capacity <= 0) {
            this.errorMessage = 'La capacidad debe ser mayor a 0';
            return false;
        }
        if (!this.nuevoGrupo.semester) {
            this.errorMessage = 'El semestre es requerido';
            return false;
        }
        if (!this.nuevoGrupo.year || this.nuevoGrupo.year < 2000) {
            this.errorMessage = 'El año debe ser válido (mayor o igual a 2000)';
            return false;
        }
        if (!this.courseId) {
            this.errorMessage = 'No se ha seleccionado un curso';
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
        // if (this.groupForm.valid && this.course) {
        //     const groupData: CreateCourseGroup = {
        //         name: this.groupForm.value.name.trim(),
        //         capacity: Number(this.groupForm.value.capacity),
        //         semester: this.groupForm.value.semester,
        //         year: Number(this.groupForm.value.year),
        //         courseId: this.course.id
        //     };

        //     this.coursesService.createCourseGroup(this.course.id, groupData).subscribe({
        //         next: (group) => {
        //             this.groups.push(group);
        //             this.showGroupForm = false;
        //             this.groupForm.reset();
        //             window.alert('Grupo creado exitosamente');
        //         },
        //         error: (error) => this.handleError(error)
        //     });
        // }
    }

    addSchedule(): void {
        if (this.scheduleForm.valid && this.selectedGroupId !== null) {
            const formValue = this.scheduleForm.value;

            // Asegurarnos de que weekDay sea un valor válido del enum
            const weekDay = formValue.weekDay as WeekDay;
            if (!Object.values(WeekDay).includes(weekDay)) {
                this.errorMessage = 'El día de la semana no es válido';
                return;
            }

            // Convertir classDate a string en formato YYYY-MM-DD
            const classDate = new Date(formValue.classDate).toISOString().split('T')[0];

            // Combinar classDate con startTime y endTime
            const startTime = `${classDate}T${formValue.startTime}:00`; // Formato YYYY-MM-DDTHH:mm:ss
            const endTime = `${classDate}T${formValue.endTime}:00`;     // Formato YYYY-MM-DDTHH:mm:ss

            // Crear el objeto scheduleData con los tipos correctos
            const scheduleData: CreateScheduleDto = {
                startTime: startTime, // Formato YYYY-MM-DDTHH:mm:ss
                endTime: endTime,     // Formato YYYY-MM-DDTHH:mm:ss
                weekDay: weekDay,
                classroom: formValue.classroom.trim(),
                classDate: classDate, // Formato YYYY-MM-DD
                groupId: this.selectedGroupId
            };

            console.log('Enviando horario:', scheduleData);
            this.groupsService.createSchedule(scheduleData).subscribe({
                next: () => {
                    console.log('Horario creado exitosamente');
                    this.cargarGrupos();
                    this.showScheduleForm = false;
                    this.scheduleForm.reset();
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