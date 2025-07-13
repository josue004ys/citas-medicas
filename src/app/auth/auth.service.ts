import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private URL = 'http://localhost:8081/api/auth';
  private currentUser: any = null;

  constructor(private http: HttpClient, private router: Router) {
    // Recuperar usuario del localStorage si existe
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Error al cargar usuario guardado:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(correo: string, password: string) {
    return this.http.post(`${this.URL}/login`, { correo, password });
  }

  register(correo: string, password: string, nombre: string, rol?: string) {
    const payload: any = { correo, password, nombre };
    if (rol) {
      payload.rol = rol;
    }
    return this.http.post(`${this.URL}/register`, payload);
  }

  guardarUsuario(userData: any) {
    this.currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  obtenerUsuario(): any {
    return this.currentUser;
  }

  obtenerCorreo(): string | null {
    return this.currentUser ? this.currentUser.correo : null;
  }

  obtenerDoctorId(): number | null {
    if (!this.currentUser) {
      console.log('🔍 obtenerDoctorId: No hay usuario logueado');
      return null;
    }

    console.log('🔍 obtenerDoctorId: Usuario actual:', this.currentUser);

    // Intentar obtener doctorId de diferentes formas
    let doctorId = null;

    // Forma 1: directamente como doctorId
    if (this.currentUser.doctorId) {
      doctorId = this.currentUser.doctorId;
      console.log('🔍 obtenerDoctorId: Encontrado como doctorId:', doctorId);
    }
    // Forma 2: como id (si el usuario es un doctor)
    else if (this.currentUser.id && this.esDoctor()) {
      doctorId = this.currentUser.id;
      console.log('🔍 obtenerDoctorId: Encontrado como id (es doctor):', doctorId);
    }

    // Convertir a número si es string
    if (doctorId && typeof doctorId === 'string') {
      doctorId = parseInt(doctorId);
      console.log('🔍 obtenerDoctorId: Convertido a número:', doctorId);
    }

    console.log('🔍 obtenerDoctorId: Resultado final:', doctorId);
    return doctorId;
  }

  // Nuevos métodos para manejar roles
  obtenerRol(): string | null {
    return this.currentUser ? this.currentUser.rol : null;
  }

  obtenerRolDescripcion(): string | null {
    return this.currentUser ? this.currentUser.rolDescripcion : null;
  }

  esPaciente(): boolean {
    return this.obtenerRol() === 'PACIENTE';
  }

  esAsistente(): boolean {
    return this.obtenerRol() === 'ASISTENTE';
  }

  esMedico(): boolean {
    const rol = this.obtenerRol();
    return rol === 'MEDICO' || rol === 'DOCTOR';
  }

  esDoctor(): boolean {
    return this.esMedico(); // Alias para mayor claridad
  }

  // Verificar permisos
  puedeAgendarCitas(): boolean {
    return this.esPaciente() || this.esAsistente();
  }

  puedeAgendarParaOtros(): boolean {
    return this.esAsistente();
  }

  puedeAtenderCitas(): boolean {
    return this.esMedico();
  }

  estaAutenticado(): boolean {
    return this.currentUser !== null;
  }

  isLoggedIn(): boolean {
    return this.estaAutenticado();
  }

  cerrarSesion() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    console.log('✅ Sesión cerrada');
    this.router.navigate(['/login']);
  }
}
