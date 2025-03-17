import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Department, DepartmentDto } from '../../core/interfaces/departments';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentsService } from '../../core/services/departments.service';
import { ProfessorsService } from '../../core/services/professors.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DepartmentsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

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

  private handleError(error: HttpErrorResponse): void {
    console.error('Error:', error);
    if (error.status === 401) {
      console.log('Redirigiendo al login por error de autorización');
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
    } else {
      console.error('Error en la operación:', error);
      window.alert(error.error?.message || 'Error desconocido');
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDepartmentsWithProfessors();
    }
  }

  loadDepartmentsWithProfessors() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.professorService.getProfessors().subscribe({
          next: (professors) => {
            this.departments = departments.map(dept => ({
              ...dept,
              professorCount: professors.filter(
                prof => prof.professor?.department?.id === dept.id
              ).length
            }));
            this.filteredDepartments = [...this.departments];
          },
          error: (err) => this.handleError(err)
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  crearDepartamento() {
    if (this.departamentoForm.invalid) {
      window.alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.departamentoForm.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.departamentoForm.value.name.trim(),
      description: this.departamentoForm.value.description.trim(),
    };

    this.departmentService.createDepartment(payload).subscribe({
      next: (result) => {
        this.departments.push({ ...result, professorCount: 0 });
        this.filteredDepartments = [...this.departments];
        this.departamentoForm.reset();
        this.mostrarFormulario = false;
        window.alert('Departamento creado exitosamente');
      },
      error: (err) => this.handleError(err)
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
      window.alert('Por favor, complete todos los campos obligatorios correctamente.');
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
        window.alert('Departamento actualizado exitosamente');
      },
      error: (err) => this.handleError(err)
    });
  }

  eliminarDepartamento(id: string) {
    if (confirm('¿Está seguro que desea eliminar este departamento?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(dep => dep.id !== Number(id));
          this.filteredDepartments = [...this.departments];
          window.alert('Departamento eliminado exitosamente');
        },
        error: (err) => this.handleError(err)
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