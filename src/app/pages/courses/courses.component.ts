import { CoursesService } from './../../core/services/courses.service';
import { Component, OnInit } from '@angular/core';
import { Department } from '../../core/interfaces/departments';
import { DepartmentsService } from '../../core/services/departments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../core/interfaces/courses';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
  imports: [CommonModule, FormsModule]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  departments: Department[] = [];

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoCurso: Course = { id: '', name: '', description: '', professor: '' };
  cursoAEditar: Course = { id: '', name: '', description: '', professor: '' };
  cursoAEliminar: Course = { id: '', name: '', description: '', professor: '' };
  cursoABuscar: Course = { id: '', name: '', description: '', professor: '' };

  constructor(private courseService: CoursesService) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (result) => {
        this.courses = result;
        console.log(this.courses);
        
      }
    });
  }

  crearCurso() {
  
  }

  editarCurso(id: string) {
  
  }

  actualizarCurso() {
  
  }

  eliminarCurso() {
  
  }

  buscarCurso() {
  
  }
}
