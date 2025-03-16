import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: "course-groups/:courseId/:groupId/schedules", 
        loadComponent: () => import('./schedules/schedules.component').then(m => m.SchedulesComponent)
    },
    { 
        path: "course-groups/:courseId", 
        loadComponent: () => import('./course-groups/course-groups.component').then(m => m.CourseGroupsComponent)
    },
    { 
        path: "course-groups", 
        loadComponent: () => import('./course-groups/course-groups.component').then(m => m.CourseGroupsComponent)
    },
    { 
        path: "courses", 
        loadComponent: () => import('./courses/courses.component').then(m => m.CoursesComponent)
    },
    { 
        path: "enrollments", 
        loadComponent: () => import('./enrollments/enrollments.component').then(m => m.EnrollmentsComponent)
    },
    { 
        path: "professors", 
        loadComponent: () => import('./professors/professors.component').then(m => m.ProfessorsComponent)
    },
    { 
        path: "students", 
        loadComponent: () => import('./students/students.component').then(m => m.StudentsComponent)
    },
    { 
        path: "departments", 
        loadComponent: () => import('./departments/departments.component').then(m => m.DepartmentsComponent)
    },
    { 
        path: "evaluations", 
        loadComponent: () => import('./evaluations/evaluations.component').then(m => m.EvaluationsComponent)
    },
    { 
        path: "profile", 
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
    },
    { 
        path: "login", 
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    { 
        path: "", 
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    }
];