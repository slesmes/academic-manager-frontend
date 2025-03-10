import { Component, OnInit } from '@angular/core';
import { Professor, CreateProfessorDto, UpdateProfessorDto } from '../../core/interfaces/professors';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfessorsService } from '../../core/services/professors.service';
import { DepartmentsService } from '../../core/services/departments.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
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
    private fb: FormBuilder
  ) {
    this.professorForm = this.initializeProfessorForm();
    this.editProfessorForm = this.initializeEditProfessorForm();
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
      error: (err) => {
        console.error('Error al cargar datos:', err);
        alert('Error al cargar los datos necesarios');
      }
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
          alert('Profesor creado exitosamente');
        },
        error: (err) => {
          console.error('Error al crear profesor:', err);
          const errorMessage = err.error?.message || 'Error desconocido';
          alert('Error al crear el profesor: ' + errorMessage);
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos correctamente.');
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
      alert('No se encontró la información completa del profesor');
    }
  }

  actualizarProfesor() {
    if (this.editProfessorForm.valid && this.selectedProfessorId) {
      const formValue = this.editProfessorForm.value;
      
      const updateData: UpdateProfessorDto = {
        name: formValue.name,
        email: formValue.email,
        professor: {
          hireDate: formValue.hireDate,
          departmentId: parseInt(formValue.departmentId)
        }
      };

      this.professorService.updateProfessor(this.selectedProfessorId, updateData).subscribe({
        next: (result) => {
          const index = this.professors.findIndex(p => p.id === this.selectedProfessorId);
          if (index !== -1) {
            this.professors[index] = result;
            this.filteredProfessors = [...this.professors];
          }
          this.mostrarFormularioEdicion = false;
          this.selectedProfessorId = '';
          alert('Profesor actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error al actualizar profesor:', err);
          alert('Error al actualizar el profesor');
        }
      });
    }
  }

  eliminarProfesor(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este profesor?')) {
      this.professorService.deleteProfessor(id).subscribe({
        next: () => {
          this.professors = this.professors.filter(p => p.id !== id);
          this.filteredProfessors = this.professors.filter(p => p.id !== id);
          alert('Profesor eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar profesor:', err);
          alert('Error al eliminar el profesor');
        }
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