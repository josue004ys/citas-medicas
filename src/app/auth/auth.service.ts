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
    console.log('✅ Usuario guardado en localStorage:', userData);
  }

  obtenerUsuario(): any {
    return this.currentUser;
  }

  obtenerCorreo(): string | null {
    return this.currentUser ? this.currentUser.correo : null;
  }

  obtenerDoctorId(): number | null {
    return this.currentUser && this.currentUser.doctorId ? this.currentUser.doctorId : null;
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

  // Método para inicializar datos de demo
  initDemoData() {
    return this.http.post(`${this.URL}/init-demo-data`, {});
  }

  // Método para simular login con usuario demo
  loginDemo() {
    const demoUser = {
      correo: 'paciente@test.com',
      nombre: 'María González',
      rol: 'PACIENTE',
      rolDescripcion: 'Paciente',
      mensaje: 'Login demo exitoso'
    };
    this.guardarUsuario(demoUser);
    return Promise.resolve(demoUser);
  }

  // Método para cambiar roles en demo
  cambiarARol(nuevoRol: string) {
    if (this.currentUser) {
      if (nuevoRol === 'doctor') {
        this.currentUser.rol = 'MEDICO';
        this.currentUser.rolDescripcion = 'Médico';
        this.currentUser.nombre = 'Dr. Juan Pérez';
      } else {
        this.currentUser.rol = 'PACIENTE';
        this.currentUser.rolDescripcion = 'Paciente';
        this.currentUser.nombre = 'María González';
      }
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      console.log('🔄 Rol cambiado a:', nuevoRol);
    }
  }
}
