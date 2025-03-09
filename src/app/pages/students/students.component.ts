import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Student } from '../../core/interfaces/students';
import { StudentService } from '../../core/services/student.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  nuevoEstudiante: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  estudianteAEditar: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  estudianteABuscar: Partial<Student> = { id: '' };
  estudianteAEliminar: Student = { id: '', name: '', lastname:'', birthdate: new Date() };
  filteredestudiante: Student[] = [];
  studentForm: FormGroup;
  editStudentForm: FormGroup;

  constructor(private studentservice: StudentService, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      birthdate: ['', Validators.required]
    });

    this.editStudentForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      birthdate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.studentservice.getStudent().subscribe({
      next: (result) => {
        this.students = result;
        this.filteredestudiante = result; 
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
      }
    });
  }

  crearEstudiante() {

    if (this.studentForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.studentForm.markAllAsTouched();
      return;
    }

    const payload = this.studentForm.value;

    this.studentservice.createStudent(payload as any).subscribe({
      next: (result) => {
        this.students.push(result);
        this.studentForm.reset();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error('Error al crear estudiante:', err);
      }
    });
  }

  editarEstudiante(id: string) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      this.estudianteAEditar = { ...student };
      this.editStudentForm.patchValue({
        id: student.id,
        name: student.name,
        lastname: student.lastname,
        birthdate: student.birthdate
      });
    }
  }

  actualizarEstudiante() {
    if (this.editStudentForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      this.editStudentForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editStudentForm.value,
      birthdate: new Date(this.editStudentForm.value.birthdate)
    };

    this.studentservice.updateStudent(payload).subscribe({
      next: (result) => {
        const index = this.students.findIndex(s => s.id === result.id);
        if (index !== -1) {
          this.students[index] = result;
          this.filteredestudiante = [...this.students];
        }
        this.editStudentForm.reset();
        this.mostrarFormularioEdicion = false;
        alert('Estudiante actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar estudiante:', err);
        alert('Error al actualizar el estudiante: ' + err.error.message);
      }
    });
  }

  eliminarEstudiante(id: string) {
    if (confirm('¿Está seguro que desea eliminar este estudiante?')) {
      this.studentservice.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== id);
          this.filteredestudiante = [...this.students];
          alert('Estudiante eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar estudiante:', err);
          alert('Error al eliminar el estudiante: ' + err.error.message);
        }
      });
    }
  }

  buscarEstudiante(): void {
    if (!this.estudianteABuscar.id) {
      this.filteredestudiante = [...this.students];
      return;
    }

    this.filteredestudiante = this.students.filter(student => 
      student.id.toLowerCase().includes(this.estudianteABuscar.id!.toLowerCase()) ||
      student.name.toLowerCase().includes(this.estudianteABuscar.id!.toLowerCase()) ||
      student.lastname.toLowerCase().includes(this.estudianteABuscar.id!.toLowerCase())
    );
  }
}
