import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../core/interfaces/students';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StudentsComponent implements OnInit {

  students: Student[] = [
    {id:'1' ,name: 'Santiago', lastname:'Lesmes', birthdate: new Date('2004-02-13') }
  ];
  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  nuevoEstudiante: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  estudianteAEditar: Student = { id: '', name: '', lastname:'', birthdate: new Date() };

  constructor() { }

  ngOnInit(): void {
    // Fetch students from the service
  }

  crearEstudiante() {
    // Logic to create a student
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
}
