import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoursesComponent } from "./pages/courses/courses.component";
import { DepartmentsComponent } from "./pages/departments/departments.component";
import { EnrollmentsComponent } from "./pages/enrollments/enrollments.component";
import { EvaluationsComponent } from "./pages/evaluations/evaluations.component";
import { ProfessorsComponent } from "./pages/professors/professors.component";
import { StudentsComponent } from "./pages/students/students.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "courses", component: CoursesComponent, canActivate: [AuthGuard] },
    { path: "departments", component: DepartmentsComponent, canActivate: [AuthGuard] },
    { path: "enrollments", component: EnrollmentsComponent, canActivate: [AuthGuard] },
    { path: "evaluations", component: EvaluationsComponent, canActivate: [AuthGuard] },
    { path: "professors", component: ProfessorsComponent, canActivate: [AuthGuard] },
    { path: "students", component: StudentsComponent, canActivate: [AuthGuard] },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "", redirectTo: "profile", pathMatch: "full" },
    { path: "**", redirectTo: "profile" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {} 