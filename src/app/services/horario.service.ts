import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API } from '../core/config/api';

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
  providedIn: 'root',
})
export class HorarioService {
  private apiUrl = `${BASE_API}/horarios`;

  constructor(private http: HttpClient) {}

  crearHorario(horario: HorarioDoctor): Observable<any> {
    return this.http.post<any>(this.apiUrl, horario);
  }

  obtenerHorariosPorDoctor(doctorId?: number): Observable<HorarioDoctor[]> {
    if (doctorId) {
      return this.http.get<HorarioDoctor[]>(
        `${this.apiUrl}/doctor/${doctorId}`
      );
    } else {
      return this.http.get<HorarioDoctor[]>(`${this.apiUrl}/mis-horarios`);
    }
  }

  obtenerHorariosDisponibles(
    doctorId: number,
    fecha: string
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('fecha', fecha);

    return this.http.get<string[]>(
      `${this.apiUrl}/doctor/${doctorId}/disponibles`,
      { params }
    );
  }

  actualizarHorario(
    id: number,
    horario: HorarioDoctor
  ): Observable<HorarioDoctor> {
    return this.http.put<HorarioDoctor>(`${this.apiUrl}/${id}`, horario);
  }

  toggleEstadoHorario(
    id: number,
    activar: boolean,
    motivo?: string
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-estado`, {});
  }

  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
