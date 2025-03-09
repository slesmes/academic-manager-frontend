import { Component, OnInit } from '@angular/core';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentsService } from '../../core/services/departments.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
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

  departamentoForm: FormGroup;
  editarDepartamentoForm: FormGroup;

  constructor(private departmentService:DepartmentsService) {
    this.departamentoForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      description: new FormControl('', Validators.required)
    });

    this.editarDepartamentoForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      description: new FormControl('', Validators.required),
      creationDate: new FormControl('', Validators.required)
    });
  }

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
    if (this.departamentoForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }

    const payload: Omit<Department, 'id'> = {
      name: this.departamentoForm.value.name,
      description: this.departamentoForm.value.description,
      creationDate: new Date()
    };
  
    this.departmentService.createDepartment(payload as any).subscribe({
      next: (result) => {
        this.departments.push(result);
        this.departamentoForm.reset();
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
      this.editarDepartamentoForm.setValue({
        id: this.departamentoAEditar.id,
        name: this.departamentoAEditar.name,
        description: this.departamentoAEditar.description,
        creationDate: this.departamentoAEditar.creationDate
      });
    } else {
      this.departmentService.getDepartmentById(codigo).subscribe({
        next: (result) => {
          this.departamentoAEditar = result;
          this.editarDepartamentoForm.setValue({
            id: this.departamentoAEditar.id,
            name: this.departamentoAEditar.name,
            description: this.departamentoAEditar.description,
            creationDate: this.departamentoAEditar.creationDate
          });
        },
        error: (err) => {
          console.error('Error al obtener departamento:', err);
        }
      });
    }
  }

  actualizarDepartamento(): void {
    if (this.editarDepartamentoForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }

    this.departmentService.updateDepartment(this.editarDepartamentoForm.value).subscribe({
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