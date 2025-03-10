import { Component, OnInit } from '@angular/core';
import { Department, DepartmentDto } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentsService } from '../../core/services/departments.service';
import { ProfessorsService } from '../../core/services/professors.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DepartmentsComponent implements OnInit {

  departments: (Department & { professorCount: number })[] = [];
  filteredDepartments: (Department & { professorCount: number })[] = [];

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoDepartamento: DepartmentDto = { name: '', description: '' };
  departamentoAEditar: Department = { id: 0, name: '', description: "", creationDate: new Date() };
  departamentoAEliminar: Department = { id: 0, name: '', description: "", creationDate: new Date() };
  departamentoABuscar: Partial<Department> = { id: 0, name: '' };

  departamentoForm: FormGroup;
  editarDepartamentoForm: FormGroup;

  constructor(
    private departmentService: DepartmentsService,
    private professorService: ProfessorsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.departamentoForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      description: ['', Validators.required]
    });

    this.editarDepartamentoForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      description: ['', Validators.required],
      creationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartmentsWithProfessors();
  }

  loadDepartmentsWithProfessors() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.professorService.getProfessors().subscribe({
          next: (professors) => {
            this.departments = departments.map(dept => ({
              ...dept,
              professorCount: professors.filter(prof => prof.department.id === dept.id).length
            }));
            this.filteredDepartments = [...this.departments];
          },
          error: (err) => {
            console.error('Error al obtener profesores:', err);
            alert('Error al obtener los profesores');
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
        alert('Error al obtener los departamentos');
      }
    });
  }

  crearDepartamento() {
    if (this.departamentoForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.departamentoForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.departamentoForm.value,
    };

    this.departmentService.createDepartment(payload).subscribe({
      next: (result) => {
        this.departments.push({ ...result, professorCount: 0 });
        this.filteredDepartments = [...this.departments];
        this.departamentoForm.reset();
        this.mostrarFormulario = false;
        alert('Departamento creado exitosamente');
      },
      error: (err) => {
        console.error('Error al crear departamento:', err);
        alert('Error al crear el departamento');
      }
    });
  }

  editarDepartamento(id: string) {
    const department = this.departments.find(dep => dep.id === Number(id));
    if (department) {
      this.editarDepartamentoForm.patchValue({
        id: department.id,
        name: department.name,
        description: department.description,
        creationDate: new Date(department.creationDate).toISOString().split('T')[0]
      });
    }
  }

  actualizarDepartamento() {
    if (this.editarDepartamentoForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.editarDepartamentoForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editarDepartamentoForm.value,
      creationDate: new Date(this.editarDepartamentoForm.value.creationDate)
    };

    this.departmentService.updateDepartment(payload).subscribe({
      next: (result) => {
        const index = this.departments.findIndex(dep => dep.id === result.id);
        if (index !== -1) {
          this.departments[index] = { ...result, professorCount: this.departments[index].professorCount };
          this.filteredDepartments = [...this.departments];
        }
        this.editarDepartamentoForm.reset();
        this.mostrarFormularioEdicion = false;
        alert('Departamento actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar departamento:', err);
        alert('Error al actualizar el departamento: ' + err.error.message);
      }
    });
  }

  eliminarDepartamento(id: string) {
    if (confirm('¿Está seguro que desea eliminar este departamento?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(dep => dep.id !== Number(id));
          this.filteredDepartments = [...this.departments];
          alert('Departamento eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar departamento:', err);
          alert('Error al eliminar el departamento: ' + err.error.message);
        }
      });
    }
  }

  buscarDepartamento(): void {
    const searchTerm = this.departamentoABuscar.id?.toString().toLowerCase() || '';
    const searchName = this.departamentoABuscar.name?.toLowerCase() || '';

    if (!searchTerm && !searchName) {
      this.filteredDepartments = [...this.departments];
      return;
    }

    this.filteredDepartments = this.departments.filter(dep =>
      dep.id.toString().toLowerCase().includes(searchTerm) ||
      dep.name.toLowerCase().includes(searchTerm) ||
      dep.description.toLowerCase().includes(searchTerm)
    );
  }

  navigateToProfessors(departmentId: number) {
    this.router.navigate(['/professors'], {
      queryParams: { departmentId: departmentId }
    });
  }
}