import { Component, OnInit } from '@angular/core';
import { Professor } from '../../core/interfaces/professors';
import { Department } from '../../core/interfaces/departments';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfessorsService } from '../../core/services/professors.service';
import { DepartmentsService } from '../../core/services/departments.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
  nuevoProfesor: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
  profesorAEditar: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
  profesorABuscar: Partial<Professor> = { id: '', name: '' };
  profesorAEliminar: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };

  professorForm: FormGroup;
  editProfessorForm: FormGroup;

  constructor(
    private professorService: ProfessorsService,
    private departmentService: DepartmentsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.professorForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      hireDate: ['', Validators.required],
      departmentId: ['', Validators.required]
    });

    this.editProfessorForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      hireDate: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Primero cargamos los profesores
    this.professorService.getProfessors().subscribe({
      next: (result) => {
        this.professors = result;
        this.filteredProfessors = result;
        
        // Una vez que tenemos los profesores, nos suscribimos a los cambios de URL
        this.route.queryParams.subscribe(params => {
          const departmentId = params['departmentId'];
          if (departmentId) {
            this.filterByDepartment(Number(departmentId));
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener profesores:', err);
        alert('Error al obtener los profesores');
      }
    });

    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (result) => {
        this.departments = result;
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
        alert('Error al obtener los departamentos');
      }
    });
  }

  crearProfesor() {
    if (this.professorForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.professorForm.markAllAsTouched();
      return;
    }

    const formValue = this.professorForm.value;
    const department = this.departments.find(d => d.id === Number(formValue.departmentId));

    if (!department) {
      alert('Por favor, seleccione un departamento válido');
      return;
    }

    const payload = {
      id: formValue.id,
      name: formValue.name,
      hireDate: new Date(formValue.hireDate),
      department: department
    };

    this.professorService.createProfessor(payload).subscribe({
      next: (result) => {
        this.professors.push(result);
        this.filteredProfessors = [...this.professors];
        this.professorForm.reset();
        this.mostrarFormulario = false;
        alert('Profesor creado exitosamente');
      },
      error: (err) => {
        console.error('Error al crear profesor:', err);
        alert('Error al crear el profesor');
      }
    });
  }

  editarProfesor(id: string) {
    const professor = this.professors.find(p => p.id === id);
    if (professor) {
      this.editProfessorForm.patchValue({
        id: professor.id,
        name: professor.name,
        hireDate: new Date(professor.hireDate).toISOString().split('T')[0],
        departmentId: professor.department.id
      });
    }
  }

  actualizarProfesor() {
    if (this.editProfessorForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.editProfessorForm.markAllAsTouched();
      return;
    }

    const formValue = this.editProfessorForm.value;
    const department = this.departments.find(d => d.id === Number(formValue.departmentId));

    if (!department) {
      alert('Por favor, seleccione un departamento válido');
      return;
    }

    const payload = {
      id: formValue.id,
      name: formValue.name,
      hireDate: new Date(formValue.hireDate),
      department: department
    };

    this.professorService.updateProfessor(payload).subscribe({
      next: (result) => {
        const index = this.professors.findIndex(p => p.id === result.id);
        if (index !== -1) {
          this.professors[index] = result;
          this.filteredProfessors = [...this.professors];
        }
        this.editProfessorForm.reset();
        this.mostrarFormularioEdicion = false;
        alert('Profesor actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar profesor:', err);
        alert('Error al actualizar el profesor: ' + err.error.message);
      }
    });
  }

  eliminarProfesor(id: string) {
    if (confirm('¿Está seguro que desea eliminar este profesor?')) {
      this.professorService.deleteProfessor(id).subscribe({
        next: () => {
          this.professors = this.professors.filter(p => p.id !== id);
          this.filteredProfessors = [...this.professors];
          alert('Profesor eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar profesor:', err);
          alert('Error al eliminar el profesor: ' + err.error.message);
        }
      });
    }
  }

  buscarProfesor(): void {
    const searchTerm = this.profesorABuscar.id?.toLowerCase() || '';
    const searchName = this.profesorABuscar.name?.toLowerCase() || '';

    if (!searchTerm && !searchName) {
      this.filteredProfessors = [...this.professors];
      return;
    }

    this.filteredProfessors = this.professors.filter(prof => 
      prof.id.toLowerCase().includes(searchTerm) ||
      prof.name.toLowerCase().includes(searchTerm) ||
      prof.department.name.toLowerCase().includes(searchTerm)
    );
  }

  filterByDepartment(departmentId: number) {
    this.filteredProfessors = this.professors.filter(prof => 
      prof.department.id === departmentId
    );
  }
}