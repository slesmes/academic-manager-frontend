import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoursesComponent } from "./courses/courses.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { EnrollmentsComponent } from "./enrollments/enrollments.component";
import { EvaluationsComponent } from "./evaluations/evaluations.component";
import { ProfessorsComponent } from "./professors/professors.component";
import { StudentsComponent } from "./students/students.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
    { path: "courses", component: CoursesComponent },
    { path: "departments", component: DepartmentsComponent },
    { path: "enrollments", component: EnrollmentsComponent },
    { path: "evaluations", component: EvaluationsComponent },
    { path: "professors", component: ProfessorsComponent },
    { path: "students", component: StudentsComponent },
    { path: "login", component: LoginComponent },
    { path: "", component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
    })
export class AppRoutingModule {}