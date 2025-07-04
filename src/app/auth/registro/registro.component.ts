import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-4">Registro de Paciente</h2>
      <p class="text-muted mb-4">Crea tu cuenta para agendar citas médicas</p>

      <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre completo</label>
          <input formControlName="nombre" type="text" id="nombre" class="form-control">
          <div *ngIf="registroForm.get('nombre')?.invalid && registroForm.get('nombre')?.touched" class="text-danger">
            El nombre es requerido (mínimo 2 caracteres)
          </div>
        </div>

        <div class="mb-3">
          <label for="correo" class="form-label">Correo electrónico</label>
          <input formControlName="correo" type="email" id="correo" class="form-control">
          <div *ngIf="registroForm.get('correo')?.invalid && registroForm.get('correo')?.touched" class="text-danger">
            Ingrese un correo válido
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input formControlName="password" type="password" id="password" class="form-control">
          <div *ngIf="registroForm.get('password')?.invalid && registroForm.get('password')?.touched" class="text-danger">
            Mínimo 4 caracteres
          </div>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
          <input formControlName="confirmPassword" type="password" id="confirmPassword" class="form-control">
          <div *ngIf="registroForm.hasError('passwordMismatch') && registroForm.get('confirmPassword')?.touched" class="text-danger">
            Las contraseñas no coinciden
          </div>
        </div>

        <!-- El rol será automáticamente PACIENTE para registro público -->
        <input formControlName="rol" type="hidden" value="PACIENTE">
        
        <div class="mb-3">
          <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Registro de Pacientes</strong><br>
            Te estás registrando como paciente para agendar citas médicas.
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <button type="submit" class="btn btn-primary w-100 mb-2" [disabled]="registroForm.invalid || isLoading">
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </button>
        
        <a routerLink="/login" class="btn btn-link w-100">
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </form>
    </div>
  `
})
export class RegistroComponent {
  registroForm: FormGroup;
  error: string = '';
  success: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['PACIENTE', [Validators.required]] // Valor por defecto y validación
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registroForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.error = '';
    this.success = '';
    
    const { nombre, correo, password, rol } = this.registroForm.value;
    console.log('📤 Enviando registro para:', correo);
    
    this.auth.register(correo, password, nombre, rol).subscribe({
      next: (res: any) => {
        console.log('✅ Registro exitoso:', res);
        this.success = 'Usuario registrado exitosamente. Redirigiendo al login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        console.error('❌ Error en registro:', err);
        console.error('❌ Error completo:', JSON.stringify(err, null, 2));
        
        // Función auxiliar para convertir cualquier objeto a string legible
        const toReadableString = (obj: any): string => {
          if (obj === null || obj === undefined) return 'Error desconocido';
          if (typeof obj === 'string') return obj;
          if (typeof obj === 'number') return obj.toString();
          if (typeof obj === 'boolean') return obj.toString();
          if (obj instanceof Error) return obj.message;
          if (typeof obj === 'object') {
            if (obj.message && typeof obj.message === 'string') return obj.message;
            if (obj.error && typeof obj.error === 'string') return obj.error;
            if (obj.text && typeof obj.text === 'string') return obj.text;
            return JSON.stringify(obj);
          }
          return String(obj);
        };
        
        let errorMessage = 'Error al registrar usuario';
        
        if (err.status === 0) {
          errorMessage = 'Error de conexión con el servidor';
        } else if (err.error) {
          errorMessage = toReadableString(err.error);
        } else if (err.message) {
          errorMessage = toReadableString(err.message);
        } else if (err.statusText) {
          errorMessage = `Error ${err.status}: ${err.statusText}`;
        }
        
        // Asegurar que nunca se muestre "[object Object]"
        if (errorMessage === '[object Object]' || errorMessage.includes('[object Object]')) {
          errorMessage = `Error al registrar usuario (Código: ${err.status || 'desconocido'})`;
        }
        
        this.error = errorMessage;
        this.success = '';
        this.isLoading = false; // Importante: desactivar loading en caso de error
      },
      complete: () => {
        // Solo desactivar loading si no se desactivó ya en error
        if (this.isLoading) {
          this.isLoading = false;
        }
      }
    });
  }
}
