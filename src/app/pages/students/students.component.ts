import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../core/interfaces/students';
import { StudentService } from '../../core/services/student.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  
  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  estudianteABuscar: { searchTerm: string } = { searchTerm: '' };

  studentForm: FormGroup;
  editStudentForm: FormGroup;
  private selectedStudentId: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.studentForm = this.initializeStudentForm();
    this.editStudentForm = this.initializeEditStudentForm();
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

  private formatDate(date: string): string {
    return date.split('T')[0];
  }

  private initializeStudentForm(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      birthdate: ['', Validators.required]
    });
  }

  private initializeEditStudentForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      birthdate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.studentService.getStudent().subscribe({
      next: (result) => {
        this.students = result;
        this.filteredStudents = result;
      },
      error: (err) => this.handleError(err)
    });
  }

  crearEstudiante() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const newStudent: CreateStudentDto = {
        id: formValue.id,
        name: formValue.name.trim(),
        email: formValue.email.trim(),
        password: formValue.password,
        role: 'student',
        student: {
          lastname: formValue.lastname.trim(),
          birthdate: this.formatDate(formValue.birthdate)
        }
      };

      this.studentService.createStudent(newStudent).subscribe({
        next: (result) => {
          this.students.push(result);
          this.filteredStudents = [...this.students];
          this.studentForm.reset();
          this.mostrarFormulario = false;
          window.alert('Estudiante creado exitosamente');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      window.alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  editarEstudiante(id: string) {
    this.selectedStudentId = id;
    const student = this.students.find(s => s.id === id);
    if (student && student.student) {
      this.editStudentForm.patchValue({
        name: student.name,
        email: student.email,
        lastname: student.student.lastname,
        birthdate: this.formatDate(student.student.birthdate)
      });
      this.mostrarFormularioEdicion = true;
    } else {
      window.alert('No se encontró la información completa del estudiante');
    }
  }

  actualizarEstudiante() {
    if (this.editStudentForm.valid && this.selectedStudentId) {
      const formValue = this.editStudentForm.value;
      
      const updateData: UpdateStudentDto = {
        name: formValue.name.trim(),
        email: formValue.email.trim(),
        student: {
          lastname: formValue.lastname.trim(),
          birthdate: this.formatDate(formValue.birthdate)
        }
      };

      this.studentService.updateStudent(this.selectedStudentId, updateData).subscribe({
        next: (result) => {
          const index = this.students.findIndex(s => s.id === this.selectedStudentId);
          if (index !== -1) {
            this.students[index] = result;
            this.filteredStudents = [...this.students];
          }
          this.mostrarFormularioEdicion = false;
          this.selectedStudentId = '';
          window.alert('Estudiante actualizado exitosamente');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      window.alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  eliminarEstudiante(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== id);
          this.filteredStudents = this.students;
          window.alert('Estudiante eliminado exitosamente');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  buscarEstudiante(): void {
    const searchTerm = this.estudianteABuscar.searchTerm?.toLowerCase().trim() || '';
    
    if (!searchTerm) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter(student => 
      student.id.toLowerCase().includes(searchTerm) ||
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.student?.lastname.toLowerCase().includes(searchTerm)
    );
  }
}
