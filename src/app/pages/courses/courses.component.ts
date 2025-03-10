import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { Course, CreateCourseDto } from '../../core/interfaces/courses';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
    imports: [CommonModule, FormsModule, RouterModule],
    standalone: true
})
export class CoursesComponent implements OnInit {
    cursos: Course[] = [];
    mostrarFormulario: boolean = false;
    cursoSeleccionado: Course | null = null;
    errorMessage: string = '';

    nuevoCurso: CreateCourseDto = {
        name: '',
        description: '',
        professorId: '',
        code: ''
    };

    constructor(
        private courseService: CoursesService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cargarCursos();
    }
    
    cargarCursos() {
        this.courseService.getCourses().subscribe({
            next: (result) => {
                this.cursos = result;
                console.log('Cursos cargados:', this.cursos);
            },
            error: (err) => {
                console.error('Error al cargar cursos:', err);
                this.errorMessage = 'Error al cargar los cursos';
            }
        });
    }

    crearCurso() {
        if (!this.nuevoCurso.name.trim()) {
            this.errorMessage = 'El nombre del curso es requerido';
            return;
        }
        if (!this.nuevoCurso.professorId.trim()) {
            this.errorMessage = 'El ID del profesor es requerido';
            return;
        }

        this.errorMessage = ''; 
        
        this.courseService.createCourse(this.nuevoCurso).subscribe({
            next: (result) => {
                console.log('Curso creado:', result);
                this.cargarCursos();
                this.mostrarFormulario = false;
                this.resetNuevoCurso();
            },
            error: (err) => {
                console.error('Error al crear curso:', err);
                if (err.error && err.error.message) {
                    this.errorMessage = Array.isArray(err.error.message) 
                        ? err.error.message.join(', ') 
                        : err.error.message;
                } else {
                    this.errorMessage = 'Error al crear el curso';
                }
            }
        });
    }

    eliminarCurso(id: number) {
        if (confirm('¿Está seguro de eliminar este curso?')) {
            this.courseService.deleteCourse(id).subscribe({
                next: () => {
                    console.log('Curso eliminado');
                    this.cargarCursos();
                },
                error: (err) => {
                    console.error('Error al eliminar curso:', err);
                    this.errorMessage = 'Error al eliminar el curso';
                }
            });
        }
    }

    private resetNuevoCurso() {
        this.nuevoCurso = {
            name: '',
            description: '',
            professorId: '',
            code: ''
        };
        this.errorMessage = '';
    }

    irAGestionarGrupos(cursoId: number) {
        console.log('Intentando navegar a grupos del curso:', cursoId);
        this.router.navigate(['/course-groups/course', cursoId])
            .then(() => {
                console.log('Navegación exitosa a grupos del curso:', cursoId);
            })
            .catch(err => {
                console.error('Error al navegar:', err);
                this.errorMessage = 'Error al navegar a la gestión de grupos';
            });
    }
}
