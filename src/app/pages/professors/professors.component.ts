import { Component, OnInit } from '@angular/core';
import { Professor } from '../../core/interfaces/professors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfessorsService } from '../../core/services/professors.service';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfessorsComponent implements OnInit {

  professors: Professor[] = [];

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  nuevoProfesor: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
  profesorAEditar: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
  profesorABuscar: Partial<Professor> = { id: '' };
  profesorAEliminar: Professor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
  filteredProfessors: Professor[] = [];

  constructor(private professorService: ProfessorsService) { }

  ngOnInit(): void {
      this.professorService.getProfessors().subscribe({
        next: (result) => {
          this.professors = result;
          this.filteredProfessors = result; 
        },
        error: (err) => {
          console.error('Error al obtener profesores:', err);
        }
      });
      
    }
  
  
    crearProfesor() {
      const payload= {
        id: this.nuevoProfesor.id,
        name: this.nuevoProfesor.name,
        hireDate: new Date(),
        department: this.nuevoProfesor.department
      };
  
      this.professorService.createProfessor(payload as any).subscribe({
        next: (result) => {
          this.professors.push(result);
          this.nuevoProfesor = { id: '', name: '', hireDate: new Date(), department: { id: 0, name: '', description: '', creationDate: new Date() } };
          this.mostrarFormulario = false;
        },
        error: (err) => {
          console.error('Error al crear profesor:', err);
        }
      });
    }
    
  
    editarProfesor(codigo: string) {

    }
  
    actualizarProfesor(): void {
    }
    
    
  
    eliminarProfesor(): void {
      this.professorService.deleteProfessor(this.profesorAEliminar.id).subscribe({
        next: () => {
          this.professors = this.professors.filter(dep => dep.id !== this.profesorAEliminar.id);
          this.mostrarFormularioEliminar = false;
        },
        error: (err) => {
          console.error('Error al eliminar profesor:', err);
        }
      });
    }
  
    buscarProfesor(): void {
      
    }
}