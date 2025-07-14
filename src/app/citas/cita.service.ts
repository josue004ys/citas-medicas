import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private URL = 'http://localhost:8081/api/citas';

  constructor(private http: HttpClient) { }

  // Verificar disponibilidad de cita
  verificarDisponibilidad(fecha: string, hora: string, doctorId: number): Observable<any> {
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('hora', hora)
      .set('doctorId', doctorId.toString());

    console.log('🔍 Verificando disponibilidad:', { fecha, hora, doctorId });

    return this.http.get<any>(`${this.URL}/disponible`, { params }).pipe(
      catchError(error => {
        console.error('❌ Error en verificarDisponibilidad:', error);
        return throwError(() => error);
      })
    );
  }

  // Agendar cita 
  agendarCita(solicitud: any): Observable<any> {
    console.log('📅 Agendando cita:', solicitud);

    return this.http.post(`${this.URL}/agendar`, solicitud).pipe(
      catchError(error => {
        console.error('❌ Error en agendarCita:', error);
        return throwError(() => error);
      })
    );
  }

  // Listar citas por paciente
  listarCitasPorPaciente(correo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/paciente/${correo}`).pipe(
      catchError(error => {
        console.error('❌ Error en listarCitasPorPaciente:', error);
        return throwError(() => error);
      })
    );
  }

  // Listar citas por doctor
  listarCitasPorDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/doctor/${doctorId}`).pipe(
      catchError(error => {
        console.error('❌ Error en listarCitasPorDoctor:', error);
        return throwError(() => error);
      })
    );
  }

  // Marcar cita como atendida
  marcarComoAtendido(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.URL}/${id}/atender`, datos).pipe(
      catchError(error => {
        console.error('❌ Error en marcarComoAtendido:', error);
        return throwError(() => error);
      })
    );
  }

  // Confirmar cita
  confirmarCita(id: number): Observable<any> {
    return this.http.put(`${this.URL}/${id}/confirmar`, {}).pipe(
      catchError(error => {
        console.error('❌ Error en confirmarCita:', error);
        return throwError(() => error);
      })
    );
  }

  // Cancelar cita
  cancelarCita(id: number, motivo: string = 'Cancelación por el usuario'): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`, {
      body: { motivo }
    }).pipe(
      catchError(error => {
        console.error('❌ Error en cancelarCita:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener citas del día
  obtenerCitasHoy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/hoy`).pipe(
      catchError(error => {
        console.error('❌ Error en obtenerCitasHoy:', error);
        return throwError(() => error);
      })
    );
  }
}
