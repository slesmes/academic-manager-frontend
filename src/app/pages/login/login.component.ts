import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [CommonModule,
        ReactiveFormsModule]
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]] 
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    console.log(error);
                }
            })
        }
    }
}
