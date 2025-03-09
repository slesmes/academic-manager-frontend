import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../core/interfaces/students';
import { StudentService } from '../../core/services/studen.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  nuevoEstudiante: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  estudianteAEditar: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  estudianteABuscar: Partial<Student> = { id: '' };
  estudianteAEliminar: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  filteredestudiante: Student[] = [];

  constructor(private studentservice: StudentService) { }

  ngOnInit(): void {
    this.studentservice.getStudent().subscribe({
      next: (result) => {
        this.students = result;
        this.filteredestudiante = result; 
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
      }
    });
  }

  crearEstudiante() {
    const payload= {
      id: this.nuevoEstudiante.id,
      name: this.nuevoEstudiante.name,
      lastname: this.nuevoEstudiante.lastname,
      birthdate: this.nuevoEstudiante.birthdate
    };

    this.studentservice.createStudent(payload as any).subscribe({
      next: (result) => {
        this.students.push(result);
        this.nuevoEstudiante = { id: '', name: '', lastname:'', birthdate: new Date() };
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error('Error al crear estudiante:', err);
      }
    });
  }

  editarEstudiante(id: string) {
    // Logic to edit a student
  }

  actualizarEstudiante() {
    // Logic to update a student
  }

  eliminarEstudiante(id: string) {
    // Logic to delete a student
  }

  buscarEstudiante(): void {
  }
}
