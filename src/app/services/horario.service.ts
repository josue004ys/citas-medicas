import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HorarioDoctor {
  id?: number;
  doctorId?: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  duracionCita: number;
  estado: string;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:8081/api/horarios';

  constructor(private http: HttpClient) { }

  crearHorario(horario: HorarioDoctor): Observable<HorarioDoctor> {
    return this.http.post<HorarioDoctor>(this.apiUrl, horario);
  }

  obtenerHorariosPorDoctor(): Observable<HorarioDoctor[]> {
    return this.http.get<HorarioDoctor[]>(`${this.apiUrl}/mis-horarios`);
  }

  obtenerHorariosDisponibles(doctorId: number, fecha: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('fecha', fecha);
    
    return this.http.get<string[]>(`${this.apiUrl}/doctor/${doctorId}/disponibles`, { params });
  }

  actualizarHorario(id: number, horario: HorarioDoctor): Observable<HorarioDoctor> {
    return this.http.put<HorarioDoctor>(`${this.apiUrl}/${id}`, horario);
  }

  toggleEstadoHorario(id: number, activar: boolean, motivo?: string): Observable<HorarioDoctor> {
    const endpoint = activar ? 'activar' : 'bloquear';
    const body = motivo ? { motivo } : {};
    return this.http.put<HorarioDoctor>(`${this.apiUrl}/${id}/${endpoint}`, body);
  }

  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
