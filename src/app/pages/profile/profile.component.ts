import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo();
    if (!this.userInfo) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm.patchValue({
      email: this.userInfo.email
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      // Solo incluir contraseña si se proporcionó una nueva
      const updateData: any = {
        email: formData.email
      };

      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      this.authService.updateProfile(this.userInfo.sub, updateData).subscribe({
        next: () => {
          alert('Perfil actualizado exitosamente');
        },
        error: (error) => {
          alert(error.error?.message || 'Error al actualizar el perfil');
        }
      });
    }
  }
} 