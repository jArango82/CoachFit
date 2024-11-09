import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: RegisterData & { confirmPassword: string } = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'false'
  };

  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  togglePassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones
    if (!this.formData.nombre || !this.formData.apellido || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.errorMessage = 'El formato del email no es válido';
      return;
    }

    // Validate passwords match
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validate password strength
    if (this.formData.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    // Create registration data
    const registerData: RegisterData = {
      nombre: this.formData.nombre,
      apellido: this.formData.apellido,
      email: this.formData.email,
      password: this.formData.password,
      rol: this.formData.rol
    };

    // Submit registration
    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso';
        // Reset form
        this.formData = {
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          confirmPassword: '',
          rol: 'false'
        };
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar usuario';
      }
    });
  }
}