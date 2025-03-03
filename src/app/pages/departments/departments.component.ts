import { Component, OnInit } from '@angular/core';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [
    { codigo: 'DEP001', nombre: 'Ingeniería', profesores: [1] },
    { codigo: 'DEP002', nombre: 'Ciencias', profesores: [2] },
    { codigo: 'DEP003', nombre: 'Matemáticas', profesores: [] }
  ];

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoDepartamento: Department = { codigo: '', nombre: '', profesores: [] };
  departamentoAEditar: Department = { codigo: '', nombre: '', profesores: [] };
  departamentoAEliminar: Department = { codigo: '', nombre: '', profesores: [] };
  departamentoABuscar: Department = { codigo: '', nombre: '', profesores: [] };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  verProfesores(department: Department) {
    this.router.navigate(['/professors', { profesores: department.profesores?.join(',') || '' }]);
  }

  crearDepartamento() {
    this.departments.push({ ...this.nuevoDepartamento });
    this.nuevoDepartamento = { codigo: '', nombre: '', profesores: [] };
    this.mostrarFormulario = false;
  }

  editarDepartamento(codigo: string) {
    const departamento = this.departments.find(d => d.codigo === codigo);
    if (departamento) {
      this.departamentoAEditar = { ...departamento };
      this.mostrarFormularioEdicion = true;
    } else {
      this.departamentoAEditar = { codigo, nombre: 'No se encuentra', profesores: [] };
      this.mostrarFormularioEdicion = true;
    }
  }

  actualizarDepartamento() {
    const index = this.departments.findIndex(d => d.codigo === this.departamentoAEditar.codigo);
    if (index !== -1) {
      this.departments[index] = { ...this.departamentoAEditar };
      this.mostrarFormularioEdicion = false;
    }
  }

  eliminarDepartamento() {
    const index = this.departments.findIndex(d => d.codigo === this.departamentoAEliminar.codigo);
    if (index !== -1) {
      this.departments.splice(index, 1);
      this.mostrarFormularioEliminar = false;
    }
  }

  buscarDepartamento() {
    const departamento = this.departments.find(d => d.codigo === this.departamentoABuscar.codigo);
    if (departamento) {
      alert(`Departamento encontrado: ${departamento.nombre}`);
    } else {
      alert('Departamento no encontrado');
    }
    this.mostrarFormularioBuscar = false;
  }
}