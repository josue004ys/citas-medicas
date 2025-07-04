import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../cita.service';
import { AuthService } from '../../auth/auth.service';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  motivoConsulta: string;
  nombreDoctor: string;
  especialidadDoctor: string;
  nombrePaciente: string;
  diagnostico?: string;
  tratamiento?: string;
  observacionesDoctor?: string;
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

  constructor(
    private citaService: CitaService,
    public auth: AuthService
  ) {}

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
    
    // Simular carga con datos demo por ahora
    setTimeout(() => {
      this.citas = [
        {
          id: 1,
          fecha: '2025-07-07',
          hora: '09:30',
          estado: 'CONFIRMADA',
          motivoConsulta: 'Consulta de control cardiológico',
          nombreDoctor: 'Dr. Juan Pérez',
          especialidadDoctor: 'Cardiología',
          nombrePaciente: 'María González',
          diagnostico: 'Control rutinario',
          tratamiento: 'Mantener medicación actual'
        },
        {
          id: 2,
          fecha: '2025-07-10',
          hora: '14:15',
          estado: 'PENDIENTE',
          motivoConsulta: 'Seguimiento post-consulta',
          nombreDoctor: 'Dr. Juan Pérez',
          especialidadDoctor: 'Cardiología',
          nombrePaciente: 'María González'
        },
        {
          id: 3,
          fecha: '2025-06-30',
          hora: '10:00',
          estado: 'COMPLETADA',
          motivoConsulta: 'Evaluación inicial',
          nombreDoctor: 'Dr. Juan Pérez',
          especialidadDoctor: 'Cardiología',
          nombrePaciente: 'María González',
          diagnostico: 'Hipertensión leve',
          tratamiento: 'Dieta baja en sodio y ejercicio regular',
          observacionesDoctor: 'Paciente responde bien al tratamiento'
        }
      ];
      this.cargando = false;
      console.log('✅ Citas demo cargadas:', this.citas);
    }, 1000);
    
    // Comentado por ahora - reemplazar con datos reales cuando el backend esté listo
    /*
    this.citaService.listarCitasPorPaciente(correo).subscribe({
      next: (citas) => {
        this.citas = citas;
        this.cargando = false;
        console.log('✅ Citas cargadas:', citas);
      },
      error: (error) => {
        console.error('❌ Error al cargar citas:', error);
        this.error = 'Error al cargar las citas';
        this.cargando = false;
      }
    });
    */
  }

  formatDate(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(hora: string): string {
    const time = hora.split(':');
    const hours = parseInt(time[0]);
    const minutes = time[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
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

  verDetalles(cita: Cita): void {
    this.citaSeleccionada = cita;
  }

  cancelarCita(citaId: number): void {
    if (!confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return;
    }

    this.cancelando = true;
    this.error = '';
    
    this.citaService.cancelarCita(citaId, 'Cancelada por el paciente').subscribe({
      next: () => {
        this.mensaje = 'Cita cancelada exitosamente';
        this.cancelando = false;
        this.cargarCitas(); // Recargar la lista
        console.log('✅ Cita cancelada exitosamente');
      },
      error: (error) => {
        console.error('❌ Error al cancelar cita:', error);
        this.error = 'Error al cancelar la cita';
        this.cancelando = false;
      }
    });
  }
}
