import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EspecialidadService } from './especialidad.service';

export interface Doctor {
  id: number;
  nombre: string;
  correo: string;
  especialidad: string;
  telefono: string;
  numeroLicencia: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private URL = 'http://localhost:8081/api/doctores';

  constructor(
    private http: HttpClient,
    private especialidadService: EspecialidadService
  ) {}

  // Obtener todos los doctores activos
  obtenerDoctoresActivos(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.URL}/activos`).pipe(
      catchError(error => {
        console.error('❌ Error al obtener doctores activos:', error);
        return throwError(() => error);
      })
    );
  }

  // Buscar doctores por especialidad
  buscarPorEspecialidad(especialidad: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.URL}/especialidad/${especialidad}`).pipe(
      catchError(error => {
        console.error('❌ Error al buscar doctores por especialidad:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener doctor por ID
  obtenerDoctorPorId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.URL}/${id}`).pipe(
      catchError(error => {
        console.error('❌ Error al obtener doctor por ID:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener horarios de un doctor para una fecha específica
  obtenerHorariosDisponibles(doctorId: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.URL}/${doctorId}/horarios-disponibles?fecha=${fecha}`).pipe(
      catchError(error => {
        console.error('❌ Error al obtener horarios disponibles:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener todas las especialidades disponibles (delegado al servicio de especialidades)
  obtenerEspecialidades(): Observable<string[]> {
    return this.especialidadService.obtenerNombresEspecialidades();
  }
}
