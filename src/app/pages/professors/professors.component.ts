import { Component, OnInit } from '@angular/core';
import { Professor, CreateProfessorDto, UpdateProfessorDto } from '../../core/interfaces/professors';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfessorsService } from '../../core/services/professors.service';
import { DepartmentsService } from '../../core/services/departments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class ProfessorsComponent implements OnInit {
  professors: Professor[] = [];
  departments: Department[] = [];
  filteredProfessors: Professor[] = [];
  
  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  profesorABuscar: { searchTerm: string } = { searchTerm: '' };

  professorForm: FormGroup;
  editProfessorForm: FormGroup;
  private selectedProfessorId: string = '';

  constructor(
    private professorService: ProfessorsService,
    private departmentService: DepartmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.professorForm = this.initializeProfessorForm();
    this.editProfessorForm = this.initializeEditProfessorForm();
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

  private initializeProfessorForm(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      hireDate: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  private initializeEditProfessorForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      hireDate: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar departamentos y profesores en paralelo
    forkJoin({
      departments: this.departmentService.getDepartments(),
      professors: this.professorService.getProfessors()
    }).subscribe({
      next: (result) => {
        this.departments = result.departments;
        this.professors = result.professors;
        this.filteredProfessors = result.professors;

        // Suscribirse a los cambios de URL después de cargar los datos
        this.route.queryParams.subscribe(params => {
          const departmentId = params['departmentId'];
          if (departmentId) {
            this.filterByDepartment(Number(departmentId));
          }
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  crearProfesor() {
    if (this.professorForm.valid) {
      const formValue = this.professorForm.value;
      const newProfessor: CreateProfessorDto = {
        id: formValue.id,
        name: formValue.name.trim(),
        email: formValue.email.trim(),
        password: formValue.password,
        role: 'professor',
        professor: {
          hireDate: formValue.hireDate,
          departmentId: Number(formValue.departmentId)
        }
      };

      this.professorService.createProfessor(newProfessor).subscribe({
        next: (result) => {
          const department = this.departments.find(d => d.id === Number(formValue.departmentId));
          if (department && result.professor) {
            result.professor.department = department;
          }
          this.professors.push(result);
          this.filteredProfessors = [...this.professors];
          this.professorForm.reset();
          this.mostrarFormulario = false;
          window.alert('Profesor creado exitosamente');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      window.alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  editarProfesor(id: string) {
    this.selectedProfessorId = id;
    const professor = this.professors.find(p => p.id === id);
    if (professor && professor.professor) {
      this.editProfessorForm.patchValue({
        name: professor.name,
        email: professor.email,
        hireDate: professor.professor.hireDate.split('T')[0],
        departmentId: professor.professor.department.id
      });
      this.mostrarFormularioEdicion = true;
    } else {
      window.alert('No se encontró la información completa del profesor');
    }
  }

  actualizarProfesor() {
    if (this.editProfessorForm.valid && this.selectedProfessorId) {
      const formValue = this.editProfessorForm.value;
      const professor = this.professors.find(p => p.id === this.selectedProfessorId);
      const oldDepartmentId = professor?.professor?.department?.id;
      const newDepartmentId = Number(formValue.departmentId);
      
      const updateData: UpdateProfessorDto = {
        name: formValue.name.trim(),
        email: formValue.email.trim(),
        professor: {
          hireDate: new Date(formValue.hireDate).toISOString(),
          departmentId: newDepartmentId
        }
      };

      this.professorService.updateProfessor(this.selectedProfessorId, updateData).subscribe({
        next: (result) => {
          const index = this.professors.findIndex(p => p.id === this.selectedProfessorId);
          if (index !== -1) {
            // Actualizar el conteo de profesores en los departamentos
            if (oldDepartmentId !== newDepartmentId) {
              // Decrementar el contador del departamento anterior
              const oldDeptIndex = this.departments.findIndex(d => d.id === oldDepartmentId);
              if (oldDeptIndex !== -1) {
                const oldDept = this.departments[oldDeptIndex];
                this.departments[oldDeptIndex] = {
                  ...oldDept,
                  professorCount: (oldDept.professorCount ?? 0) - 1
                };
              }

              // Incrementar el contador del nuevo departamento
              const newDeptIndex = this.departments.findIndex(d => d.id === newDepartmentId);
              if (newDeptIndex !== -1) {
                const newDept = this.departments[newDeptIndex];
                this.departments[newDeptIndex] = {
                  ...newDept,
                  professorCount: (newDept.professorCount ?? 0) + 1
                };
              }
            }

            const department = this.departments.find(d => d.id === newDepartmentId);
            if (department && result.professor) {
              result.professor.department = department;
            }
            this.professors[index] = result;
            this.filteredProfessors = [...this.professors];
          }
          this.mostrarFormularioEdicion = false;
          this.selectedProfessorId = '';
          window.alert('Profesor actualizado exitosamente');
        },
        error: (err) => {
          this.handleError(err);
          // Recargar los datos en caso de error
          this.ngOnInit();
        }
      });
    } else {
      window.alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  eliminarProfesor(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este profesor?')) {
      this.professorService.deleteProfessor(id).subscribe({
        next: () => {
          this.professors = this.professors.filter(p => p.id !== id);
          this.filteredProfessors = this.professors.filter(p => p.id !== id);
          window.alert('Profesor eliminado exitosamente');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  buscarProfesor() {
    const searchTerm = this.profesorABuscar.searchTerm.toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredProfessors = [...this.professors];
      return;
    }

    this.filteredProfessors = this.professors.filter(prof => 
      prof.id.toLowerCase().includes(searchTerm) ||
      prof.name.toLowerCase().includes(searchTerm) ||
      prof.email.toLowerCase().includes(searchTerm) ||
      prof.professor?.department?.name.toLowerCase().includes(searchTerm)
    );
  }

  filterByDepartment(departmentId: number) {
    if (!departmentId) {
      this.filteredProfessors = [...this.professors];
      return;
    }

    this.filteredProfessors = this.professors.filter(
      p => p.professor?.department?.id === departmentId
    );
  }
}