import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { BASE_API } from '../../core/config/api';

interface Cita {
  id: number;
  fechaHora: string;
  estado: string;
  motivoConsulta: string;
  doctorNombre: string;
  doctorCorreo: string;
  doctorId: number;
  especialidad: string;
  pacienteNombre: string;
  pacienteCorreo: string;
  diagnostico?: string;
  tratamiento?: string;
  observacionesDoctor?: string;
  tipoConsulta?: string;
  numeroReprogramaciones?: number; // Número de veces que se ha reprogramado
  ultimaReprogramacion?: string; // Fecha de la última reprogramación
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.scss',
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  error: string = '';
  mensaje: string = '';
  isLoading: boolean = false;
  cargando: boolean = false;
  cancelando: boolean = false;
  citaSeleccionada: Cita | null = null;

  // Variables para la gestión de reprogramación de citas por pacientes
  mostrarFormularioReprogramar = false;
  citaAReprogramar: Cita | null = null;
  nuevaFecha = '';
  nuevaHora = '';
  motivoReprogramacion = '';
  horariosDisponibles: string[] = [];
  cargandoHorarios = false;

  private URL_BASE = BASE_API;

  constructor(private http: HttpClient, public auth: AuthService) {}

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
          this.citas = todasLasCitas.filter(
            (cita) => cita.doctorCorreo === correo
          );
          console.log('👨‍⚕️ Citas filtradas para doctor:', this.citas);
        } else {
          // Si es paciente, mostrar solo sus citas
          this.citas = todasLasCitas.filter(
            (cita) => cita.pacienteCorreo === correo
          );
          console.log('👤 Citas filtradas para paciente:', this.citas);
        }

        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar citas:', error);
        this.error =
          'Error al cargar las citas. Verifica que el servidor esté funcionando.';
        this.cargando = false;
      },
    });
  }

  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(fechaHora: string): string {
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ATENDIDA':
        return 'badge bg-success';
      case 'CANCELADA':
        return 'badge bg-danger';
      case 'CONFIRMADA':
        return 'badge bg-info';
      case 'PENDIENTE':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusIcon(estado: string): string {
    switch (estado) {
      case 'ATENDIDA':
        return 'fas fa-check-circle me-1';
      case 'CANCELADA':
        return 'fas fa-times-circle me-1';
      case 'CONFIRMADA':
        return 'fas fa-check me-1';
      case 'PENDIENTE':
        return 'fas fa-clock me-1';
      default:
        return 'fas fa-question-circle me-1';
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
      minute: '2-digit',
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
    this.http
      .put(`${this.URL_BASE}/citas/${citaId}/cancelar`, {
        motivo:
          'Cancelada por el ' + (this.auth.esDoctor() ? 'doctor' : 'paciente'),
      })
      .subscribe({
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
        },
      });
  }

  // ========= GESTIÓN DE CITAS POR PARTE DEL PACIENTE =========

  solicitarReprogramacion(cita: Cita): void {
    this.citaAReprogramar = cita;
    this.mostrarFormularioReprogramar = true;
    this.horariosDisponibles = [];
    this.nuevaHora = '';

    // Prellenar con fecha/hora actual + 1 día como sugerencia
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    this.nuevaFecha = manana.toISOString().split('T')[0];

    // Cargar horarios disponibles para la fecha por defecto
    this.cargarHorariosDisponibles();
  }

  confirmarReprogramacion(): void {
    if (!this.citaAReprogramar || !this.nuevaFecha || !this.nuevaHora) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    this.cargando = true;
    this.error = '';

    const datos = {
      nuevaFecha: this.nuevaFecha,
      nuevaHora: this.nuevaHora,
      motivo:
        this.motivoReprogramacion ||
        'Solicitud de reprogramación por el paciente',
      correoUsuario: this.auth.obtenerCorreo(),
    };

    this.http
      .post(
        `${this.URL_BASE}/citas/${this.citaAReprogramar.id}/solicitar-reprogramacion`,
        datos
      )
      .subscribe({
        next: (response: any) => {
          this.mensaje = response.mensaje || 'Cita reprogramada exitosamente';

          // Mostrar información adicional si está disponible
          if (response.reprogramacionesRestantes !== undefined) {
            this.mensaje += ` (${response.reprogramacionesRestantes} reprogramaciones restantes para esta cita)`;
          }

          this.mostrarFormularioReprogramar = false;
          this.cargarCitas(); // Recargar la lista de citas
          this.limpiarFormularioReprogramacion();
        },
        error: (error) => {
          console.error('Error al reprogramar:', error);

          // Manejar diferentes tipos de errores con mensajes específicos
          if (error.error?.error) {
            this.error = error.error.error;
          } else if (error.status === 400) {
            this.error =
              'No se puede reprogramar esta cita. Verifique las restricciones.';
          } else if (error.status === 0) {
            this.error =
              'Error de conexión. Verifique que el servidor esté funcionando.';
          } else {
            this.error =
              'Error inesperado al reprogramar la cita. Intente nuevamente.';
          }
        },
        complete: () => {
          this.cargando = false;
        },
      });
  }

  cancelarCitaPaciente(cita: Cita): void {
    const motivo = prompt('¿Por qué motivo desea cancelar la cita? (opcional)');

    if (motivo === null) {
      return; // Usuario canceló el prompt
    }

    if (!confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return;
    }

    this.cancelando = true;
    this.error = '';

    const datos = {
      motivo: motivo || 'Cancelación solicitada por el paciente',
      correoUsuario: this.auth.obtenerCorreo(),
    };

    this.http
      .put(`${this.URL_BASE}/citas/${cita.id}/cancelar-paciente`, datos)
      .subscribe({
        next: (response: any) => {
          this.mensaje = response.mensaje || 'Cita cancelada exitosamente';
          this.cargarCitas(); // Recargar la lista de citas
        },
        error: (error) => {
          this.error = error.error?.error || 'Error al cancelar la cita';
        },
        complete: () => {
          this.cancelando = false;
        },
      });
  }

  cancelarReprogramacion(): void {
    this.mostrarFormularioReprogramar = false;
    this.limpiarFormularioReprogramacion();
  }

  private limpiarFormularioReprogramacion(): void {
    this.citaAReprogramar = null;
    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.motivoReprogramacion = '';
    this.horariosDisponibles = [];
  }

  onFechaChange(): void {
    if (this.nuevaFecha && this.citaAReprogramar) {
      this.nuevaHora = ''; // Resetear hora seleccionada
      this.cargarHorariosDisponibles();
    }
  }

  cargarHorariosDisponibles(): void {
    if (!this.citaAReprogramar || !this.nuevaFecha) {
      return;
    }

    this.cargandoHorarios = true;
    this.horariosDisponibles = [];

    // Extraer el ID del doctor de la cita
    const doctorId = this.obtenerDoctorId(this.citaAReprogramar);

    this.http
      .get(
        `${this.URL_BASE}/citas/doctor/${doctorId}/horarios-disponibles?fecha=${this.nuevaFecha}`
      )
      .subscribe({
        next: (response: any) => {
          this.horariosDisponibles = response.horarios || [];
          if (this.horariosDisponibles.length === 0) {
            this.error = 'No hay horarios disponibles para esta fecha';
          } else {
            this.error = '';
          }
        },
        error: (error) => {
          this.error = 'Error al cargar horarios disponibles';
          this.horariosDisponibles = [];
        },
        complete: () => {
          this.cargandoHorarios = false;
        },
      });
  }

  private obtenerDoctorId(cita: Cita): number {
    return cita.doctorId;
  }

  /**
   * Verificar si una cita puede ser reprogramada
   */
  puedeReprogramar(cita: Cita): boolean {
    // Verificar si ya alcanzó el máximo de reprogramaciones (2)
    if (cita.numeroReprogramaciones && cita.numeroReprogramaciones >= 2) {
      return false;
    }

    // Verificar si la cita es en menos de 24 horas
    const fechaHoraCita = new Date(cita.fechaHora);
    const ahora = new Date();
    const horasHastaCita =
      (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (horasHastaCita < 24) {
      return false;
    }

    return true;
  }

  /**
   * Obtener mensaje explicativo sobre por qué no se puede reprogramar
   */
  obtenerMensajeReprogramacion(cita: Cita): string {
    if (cita.numeroReprogramaciones && cita.numeroReprogramaciones >= 2) {
      return 'Esta cita ya ha sido reprogramada el máximo de veces permitidas (2)';
    }

    const fechaHoraCita = new Date(cita.fechaHora);
    const ahora = new Date();
    const horasHastaCita =
      (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (horasHastaCita < 24) {
      const horasRestantes = Math.floor(horasHastaCita);
      return `No se puede reprogramar con menos de 24 horas de anticipación. Quedan ${horasRestantes} horas.`;
    }

    const reprogramacionesRestantes = 2 - (cita.numeroReprogramaciones || 0);
    return `Puede reprogramar esta cita ${reprogramacionesRestantes} vez(es) más`;
  }
}
