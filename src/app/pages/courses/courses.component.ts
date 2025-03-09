import { CoursesService } from './../../core/services/courses.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course, CreateCourse } from '../../core/interfaces/courses';
import { Schedule } from '../../core/interfaces/schedule';
import { Prerequisite } from '../../core/interfaces/prerequisite';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
  imports: [CommonModule, FormsModule]
})
export class CoursesComponent implements OnInit {
  cursos: Course[] = [];
  horarios: Schedule[] = [];
  prerequisitos: Prerequisite[] = [];
  mostrarModal: boolean = false;
  cursoSeleccionado: Course | null = null;

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoCurso: CreateCourse = { name: '', description: '', professorId: '' };
  cursoAEditar: Course = { id: 0, name: '', description: '', professor: { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } } };
  cursoAEliminar: Course = { id: 0, name: '', description: '', professor: { id: '', name: '', hireDate: new Date(),  department: { id: 0, name: '', description: '', creationDate: new Date() } } };
  cursoABuscar: Course = { id: 0, name: '', description: '', professor: { id: '', name: '', hireDate: new Date(),  department: { id: 0, name: '', description: '', creationDate: new Date() } } };

  constructor(private courseService: CoursesService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.courseService.getCourses().subscribe({
      next: (result) => {
        this.cursos = result;
        console.log(this.cursos);
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
      },
    });
  }

  abrirModal(curso: Course): void {
    this.cursoSeleccionado = curso;
    this.mostrarModal = true;

    this.courseService.getSchedulesByCourseId(curso.id).subscribe({
      next: (schedules) => {
        this.horarios = schedules;
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
      },
    });

    this.courseService.getPreRequisitesByCourseId(curso.id).subscribe({
      next: (prerequisites) => {
        this.prerequisitos = prerequisites;
        console.log(this.prerequisitos);

      },
      error: (err) => {
        console.error('Error al cargar prerequisitos:', err);
      },
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cursoSeleccionado = null;
    this.horarios = [];
    this.prerequisitos = [];
  }

  crearCurso() {

    this.courseService.createCourse(this.nuevoCurso).subscribe({
      next: (result) => {
        console.log('Curso creado:', result);
        this.cargarCursos();
      },
      error: (err) => {
        console.error('Error al crear curso:', err);
      },
    });
  }

  eliminarCurso(id: number) {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        console.log('Curso eliminado');
        this.cargarCursos();
      },
      error: (err) => {
        console.error('Error al eliminar curso:', err);
      },
    });
  }

  buscarCurso() {

  }
}
