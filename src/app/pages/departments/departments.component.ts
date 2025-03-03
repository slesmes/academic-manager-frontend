import { Component, OnInit } from '@angular/core';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentsService } from '../../core/services/departments.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoDepartamento: Department = { id: 0, name: '', description:"", creationDate: new Date() };
  departamentoAEditar: Department =  { id: 0, name: '', description:"", creationDate: new Date() };
  departamentoAEliminar: Department = { id: 0, name: '', description:"", creationDate: new Date() };
  departamentoABuscar: Partial<Department> = { id: 0 };

  constructor(private departmentService:DepartmentsService) { }

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (result) => {
        console.log('Departamentos recibidos:', result);
        this.departments = result;
        this.filteredDepartments = result; 
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
      }
    });
    
  }


  crearDepartamento() {
    const payload: Omit<Department, 'id'> = {
      name: this.nuevoDepartamento.name,
      description: this.nuevoDepartamento.description,
      creationDate: new Date()
    };
  
    this.departmentService.createDepartment(payload as any).subscribe({
      next: (result) => {
        this.departments.push(result);
        this.nuevoDepartamento = { id: 0, name: '', description: '', creationDate: new Date() };
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error('Error al crear departamento:', err);
      }
    });
  }
  

  editarDepartamento(codigo: string) {
    const department = this.departments.find(dep => dep.id === Number(codigo));
    if (department) {
      this.departamentoAEditar = { ...department };
    } else {
      this.departmentService.getDepartmentById(codigo).subscribe({
        next: (result) => {
          this.departamentoAEditar = result;
        },
        error: (err) => {
          console.error('Error al obtener departamento:', err);
        }
      });
    }
  }

  actualizarDepartamento(): void {
    this.departmentService.updateDepartment(this.departamentoAEditar).subscribe({
      next: (updatedDepartment) => {
        console.log(updatedDepartment)
        const index = this.departments.findIndex(dep => dep.id === updatedDepartment.id);
        if (index !== -1) {
          this.departments[index] = updatedDepartment;
        }
        this.mostrarFormularioEdicion = false;
      },
      error: (err) => {
        console.error('Error al actualizar departamento:', err);
      }
    });
  }
  
  

  eliminarDepartamento(): void {
    this.departmentService.deleteDepartment(this.departamentoAEliminar.id.toString()).subscribe({
      next: () => {
        this.departments = this.departments.filter(dep => dep.id !== this.departamentoAEliminar.id);
        this.mostrarFormularioEliminar = false;
      },
      error: (err) => {
        console.error('Error al eliminar departamento:', err);
      }
    });
  }

  buscarDepartamento(): void {
    const searchTerm = this.departamentoABuscar.id?.toString().trim() || '';
    if (searchTerm !== '') {
      this.filteredDepartments = this.departments.filter(dep => dep.id.toString().includes(searchTerm));
    } else {
      this.filteredDepartments = this.departments;
    }
  }
}