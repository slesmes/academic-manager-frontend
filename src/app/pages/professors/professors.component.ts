import { Component, OnInit } from '@angular/core';
import { Professor } from '../../core/interfaces/professors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfessorsComponent implements OnInit {

  professors: Professor[] = [
    { id: 1, nombre: 'Dr. Pérez', fechaContratacion: new Date('2010-05-15'), departamento: 'Ingeniería' },
    { id: 2, nombre: 'Lic. García', fechaContratacion: new Date('2015-09-01'), departamento: 'Ciencias' }
  ];

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  nuevoProfesor: Professor = { id: 0, nombre: '', fechaContratacion: new Date(), departamento: '' };
  profesorAEditar: Professor = { id: 0, nombre: '', fechaContratacion: new Date(), departamento: '' };
  profesoresFiltrados: Professor[] = [];
  departamentos: string[] = ['Ingeniería', 'Ciencias', 'Matemáticas', 'Literatura'];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const profesoresIds = params['profesores'];
      if (profesoresIds) {
        this.filtrarProfesores(profesoresIds.split(',').map(Number));
      } else {
        this.profesoresFiltrados = this.professors;
      }
    });
  }

  guardarProfesor() {
    this.professors.push({ ...this.nuevoProfesor });
    this.nuevoProfesor = { id: 0, nombre: '', fechaContratacion: new Date(), departamento: '' };
    this.mostrarFormulario = false;
  }

  editarProfesor(id: number) {
    const profesor = this.professors.find(p => p.id === id);
    if (profesor) {
      this.profesorAEditar = { ...profesor };
      this.mostrarFormularioEdicion = true;
    } else {
      this.profesorAEditar = { id, nombre: 'No se encuentra', fechaContratacion: new Date(), departamento: '' };
      this.mostrarFormularioEdicion = true;
    }
  }

  actualizarProfesor() {
    const index = this.professors.findIndex(p => p.id === this.profesorAEditar.id);
    if (index !== -1) {
      this.professors[index] = { ...this.profesorAEditar };
      this.mostrarFormularioEdicion = false;
    }
  }

  eliminarProfesor() {
    console.log('Eliminar Profesor');
  }

  obtenerProfesores() {
    console.log('Obtener Profesores');
  }

  filtrarProfesores(ids: number[]) {
    this.profesoresFiltrados = this.professors.filter(profesor => ids.includes(profesor.id));
  }
}