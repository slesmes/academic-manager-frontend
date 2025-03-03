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

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;
  mostrarFormularioEliminar: boolean = false;
  mostrarFormularioBuscar: boolean = false;
  nuevoDepartamento: Department = { id: '', name: '', description:"", createDate: new Date() };
  departamentoAEditar: Department =  { id: '', name: '', description:"", createDate: new Date() };
  departamentoAEliminar: Department = { id: '', name: '', description:"", createDate: new Date() };
  departamentoABuscar: Department = { id: '', name: '', description:"", createDate: new Date() };

  constructor(private departmentService:DepartmentsService) { }

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (result) =>{
        this.departments = result;
      },
      error: (err)=>{
        console.log(err)
      }
    });
  }


  crearDepartamento() {
  }

  editarDepartamento(codigo: string) {
  }

  actualizarDepartamento() {
  }

  eliminarDepartamento() {
  }

  buscarDepartamento() {
  }
}