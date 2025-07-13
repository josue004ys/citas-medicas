import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

interface Cita {
  id: number;
  fechaHora: string;
  estado: string;
  motivoConsulta: string;
  doctorNombre: string;
  doctorCorreo: string;
  especialidad: string;
  pacienteNombre: string;
  pacienteCorreo: string;
  diagnostico?: string;
  tratamiento?: string;
  observacionesDoctor?: string;
  tipoConsulta?: string;
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.scss'
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  error: string = '';
  mensaje: string = '';
  isLoading: boolean = false;
  cargando: boolean = false;
  cancelando: boolean = false;
  citaSeleccionada: Cita | null = null;

  private URL_BASE = 'http://localhost:8081/api';

  constructor(
    private http: HttpClient,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    const correo = this.auth.obtenerCorreo();
    if (!correo) {
      this.error = 'No se pudo identificar al usuario.';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    // Cargar citas desde el backend
    this.http.get<Cita[]>(`${this.URL_BASE}/citas`).subscribe({
      next: (todasLasCitas) => {
        console.log('📅 Todas las citas recibidas:', todasLasCitas);

        // Filtrar citas según el rol del usuario
        if (this.auth.esDoctor()) {
          // Si es doctor, mostrar solo sus citas
          this.citas = todasLasCitas.filter(cita =>
            cita.doctorCorreo === correo
          );
          console.log('👨‍⚕️ Citas filtradas para doctor:', this.citas);
        } else {
          // Si es paciente, mostrar solo sus citas
          this.citas = todasLasCitas.filter(cita =>
            cita.pacienteCorreo === correo
          );
          console.log('👤 Citas filtradas para paciente:', this.citas);
        }

        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar citas:', error);
        this.error = 'Error al cargar las citas. Verifica que el servidor esté funcionando.';
        this.cargando = false;
      }
    });
  }

  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(fechaHora: string): string {
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ATENDIDA': return 'badge bg-success';
      case 'CANCELADA': return 'badge bg-danger';
      case 'CONFIRMADA': return 'badge bg-info';
      case 'PENDIENTE': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  }

  getStatusIcon(estado: string): string {
    switch (estado) {
      case 'ATENDIDA': return 'fas fa-check-circle me-1';
      case 'CANCELADA': return 'fas fa-times-circle me-1';
      case 'CONFIRMADA': return 'fas fa-check me-1';
      case 'PENDIENTE': return 'fas fa-clock me-1';
      default: return 'fas fa-question-circle me-1';
    }
  }

  puedeCancel(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA';
  }

  formatearFechaHora(fechaHora: string): string {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  verDetalles(cita: Cita): void {
    this.citaSeleccionada = cita;
  }

  cancelarCita(citaId: number): void {
    if (!confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return;
    }

    this.cancelando = true;
    this.error = '';

    // Implementar cancelación a través del backend
    this.http.put(`${this.URL_BASE}/citas/${citaId}/cancelar`, {
      motivo: 'Cancelada por el ' + (this.auth.esDoctor() ? 'doctor' : 'paciente')
    }).subscribe({
      next: () => {
        this.mensaje = 'Cita cancelada exitosamente';
        this.cancelando = false;
        this.cargarCitas(); // Recargar la lista
        console.log('✅ Cita cancelada exitosamente');
      },
      error: (error: any) => {
        console.error('❌ Error al cancelar cita:', error);
        this.error = 'Error al cancelar la cita';
        this.cancelando = false;
      }
    });
  }
}
