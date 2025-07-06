import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;
  tipoLogin: string = 'paciente';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    const { correo, password } = this.loginForm.value;
    console.log('📤 Enviando login para:', correo, 'Tipo:', this.tipoLogin);

    this.auth.login(correo, password).subscribe({
      next: (res: any) => {
        console.log('✅ Respuesta del servidor:', res);
        this.isLoading = false;

        // Verificar que la respuesta tenga la estructura esperada
        if (res && res.correo) {
          // Guardar datos del usuario incluyendo información de rol
          this.auth.guardarUsuario({
            correo: res.correo,
            nombre: res.nombre,
            rol: res.rol || 'PACIENTE',
            rolDescripcion: res.rolDescripcion || 'Paciente',
            mensaje: res.mensaje
          });

          console.log('✅ Usuario logueado:', res.correo, 'Rol:', res.rol);

          // Redirigir según el rol del usuario
          this.redirigirSegunRol(res.rol);

        } else {
          console.error('❌ Respuesta del servidor no válida:', res);
          this.error = 'Error en la respuesta del servidor';
        }
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.error = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 404) {
          this.error = 'Usuario no encontrado. Verifica tu email.';
        } else if (error.status === 0) {
          this.error = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8081';
        } else {
          this.error = error.error?.mensaje || error.error || 'Error al iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }

  private redirigirSegunRol(rol: string) {
    switch (rol) {
      case 'ADMINISTRADOR':
      case 'DIRECTOR_MEDICO':
        console.log('🔧 Redirigiendo a panel administrativo...');
        this.router.navigate(['/admin-setup']);
        break;

      case 'MEDICO':
        console.log('👨‍⚕️ Redirigiendo a dashboard médico...');
        this.router.navigate(['/doctor/dashboard']);
        break;

      case 'RECEPCIONISTA':
      case 'ASISTENTE':
        console.log('📋 Redirigiendo a gestión de citas...');
        this.router.navigate(['/agendar']);
        break;

      case 'ENFERMERO':
        console.log('👩‍⚕️ Redirigiendo a panel de enfermería...');
        this.router.navigate(['/home']);
        break;

      case 'PACIENTE':
      default:
        console.log('👤 Redirigiendo a home de paciente...');
        this.router.navigate(['/home']);
        break;
    }
  }

  // Método para prellenar credenciales de administrador
  llenarCredencialesAdmin() {
    this.loginForm.patchValue({
      correo: 'admin@hospital.com',
      password: 'admin123'
    });
  }

  // Método para cambiar el tipo de login
  cambiarTipoLogin(tipo: string) {
    this.tipoLogin = tipo;
    this.error = '';

    // Limpiar formulario al cambiar de tipo
    this.loginForm.reset();

    // Si es admin, prellenar credenciales
    if (tipo === 'admin') {
      this.llenarCredencialesAdmin();
    }
  }

  // Métodos para el diseño dinámico del botón
  getBtnClass(): string {
    switch (this.tipoLogin) {
      case 'admin':
        return 'btn-warning';
      case 'personal':
        return 'btn-success';
      case 'paciente':
      default:
        return 'btn-primary';
    }
  }

  getBtnText(): string {
    switch (this.tipoLogin) {
      case 'admin':
        return 'Acceder como Administrador';
      case 'personal':
        return 'Acceder al Portal Médico';
      case 'paciente':
      default:
        return 'Ingresar como Paciente';
    }
  }
}
