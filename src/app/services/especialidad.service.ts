import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  activa: boolean;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private readonly URL = 'http://localhost:8081/api/especialidades';

  constructor(private http: HttpClient) { }

  // Obtener todas las especialidades
  obtenerTodasLasEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.URL).pipe(
      catchError(error => {
        console.error('❌ Error al obtener especialidades:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener especialidades activas
  obtenerEspecialidadesActivas(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.URL}/activas`).pipe(
      catchError(error => {
        console.error('❌ Error al obtener especialidades activas:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener especialidad por ID
  obtenerEspecialidadPorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.URL}/${id}`).pipe(
      catchError(error => {
        console.error('❌ Error al obtener especialidad por ID:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nueva especialidad
  crearEspecialidad(especialidad: Omit<Especialidad, 'id' | 'fechaCreacion'>): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.URL, especialidad).pipe(
      catchError(error => {
        console.error('❌ Error al crear especialidad:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar especialidad
  actualizarEspecialidad(id: number, especialidad: Omit<Especialidad, 'id' | 'fechaCreacion'>): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.URL}/${id}`, especialidad).pipe(
      catchError(error => {
        console.error('❌ Error al actualizar especialidad:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar especialidad
  eliminarEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      catchError(error => {
        console.error('❌ Error al eliminar especialidad:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener solo los nombres de especialidades (para compatibilidad con el código existente)
  obtenerNombresEspecialidades(): Observable<string[]> {
    return new Observable(observer => {
      this.obtenerEspecialidadesActivas().subscribe({
        next: (especialidades) => {
          const nombres = especialidades.map(esp => esp.nombre);
          observer.next(nombres);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error al obtener nombres de especialidades:', error);
          // Fallback a especialidades por defecto
          observer.next([
            'Medicina General',
            'Cardiología',
            'Pediatría',
            'Ginecología',
            'Dermatología',
            'Neurología',
            'Traumatología',
            'Oftalmología'
          ]);
          observer.complete();
        }
      });
    });
  }
}
