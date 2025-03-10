import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div class="text-xl font-bold">Academic Manager</div>
          <div class="space-x-4">
            <a routerLink="/departments" routerLinkActive="text-blue-400" class="hover:text-blue-300">Departamentos</a>
            <a routerLink="/courses" routerLinkActive="text-blue-400" class="hover:text-blue-300">Cursos</a>
            <a routerLink="/course-groups" routerLinkActive="text-blue-400" class="hover:text-blue-300">Grupos</a>
            <a routerLink="/enrollments" routerLinkActive="text-blue-400" class="hover:text-blue-300">Inscripciones</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavComponent {} 