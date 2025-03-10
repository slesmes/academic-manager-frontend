import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule
    ]
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

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
            console.log('Intentando login con:', { email });
            
            this.authService.login(email, password).subscribe({
                next: (response) => {
                    console.log('Login exitoso:', response);
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    console.log('Error detallado:', error);
                    
                    if (error.status === 0) {
                        this.errorMessage = 'No se puede conectar al servidor. Por favor, verifica tu conexión.';
                    } else if (error.status === 404) {
                        this.errorMessage = 'Usuario no encontrado. Por favor, verifica tus credenciales.';
                    } else if (error.status === 401) {
                        this.errorMessage = 'Credenciales incorrectas. Por favor, intenta nuevamente.';
                    } else {
                        this.errorMessage = 'Error al iniciar sesión. Por favor, intenta más tarde.';
                    }
                    
                    alert(this.errorMessage);
                }
            });
        } else {
            this.errorMessage = 'Por favor, completa todos los campos correctamente.';
            Object.keys(this.loginForm.controls).forEach(key => {
                const control = this.loginForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
        }
    }
}
