import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2><i class="fas fa-user-md me-2"></i>Dashboard del Doctor</h2>
              <p class="text-muted mb-0">Bienvenido, {{ auth.obtenerUsuario()?.nombre || 'Doctor' }}</p>
            </div>
            <div class="badge bg-success fs-6">
              <i class="fas fa-stethoscope me-1"></i>{{ auth.obtenerRolDescripcion() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de resumen -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center bg-primary text-white">
            <div class="card-body">
              <i class="fas fa-calendar-check fa-2x mb-2"></i>
              <h5>{{ citasHoy.length }}</h5>
              <small>Citas Hoy</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-success text-white">
            <div class="card-body">
              <i class="fas fa-calendar-week fa-2x mb-2"></i>
              <h5>{{ citasFuturas.length }}</h5>
              <small>Próximas Citas</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-warning text-white">
            <div class="card-body">
              <i class="fas fa-clock fa-2x mb-2"></i>
              <h5>{{ citasPendientes.length }}</h5>
              <small>Pendientes</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-info text-white">
            <div class="card-body">
              <i class="fas fa-calendar-alt fa-2x mb-2"></i>
              <h5>{{ todasLasCitas.length }}</h5>
              <small>Total Citas</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de citas del día y futuras -->
      <div class="row">
        <!-- Citas de Hoy -->
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="fas fa-calendar-day me-2"></i>Citas de Hoy</h5>
              <button class="btn btn-sm btn-outline-primary" (click)="cargarCitas()">
                <i class="fas fa-sync-alt"></i> Actualizar
              </button>
            </div>
            <div class="card-body">
              <div *ngIf="cargando" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <div *ngIf="!cargando && citasHoy.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-calendar-times fa-3x mb-3"></i>
                <p>No tienes citas programadas para hoy</p>
              </div>

              <div *ngIf="!cargando && citasHoy.length > 0" class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Hora</th>
                      <th>Paciente</th>
                      <th>Tipo de Consulta</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let cita of citasHoy">
                      <td><strong>{{ formatearHora(cita.fechaHora) }}</strong></td>
                      <td>
                        <i class="fas fa-user me-1"></i>
                        {{ cita.pacienteNombre || 'Sin especificar' }}
                      </td>
                      <td>{{ cita.tipoConsulta || 'Consulta general' }}</td>
                      <td>
                        <span class="badge" [ngClass]="getEstadoBadgeClass(cita.estado)">
                          {{ cita.estado || 'PROGRAMADA' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-success me-1" 
                                *ngIf="cita.estado !== 'COMPLETADA'"
                                (click)="marcarComoCompletada(cita)">
                          <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" 
                                (click)="verDetalles(cita)">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Citas Futuras -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0"><i class="fas fa-calendar-week me-2"></i>Próximas Citas</h5>
            </div>
            <div class="card-body">
              <div *ngIf="!cargando && citasFuturas.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-calendar-plus fa-3x mb-3"></i>
                <p>No tienes citas programadas próximamente</p>
              </div>

              <div *ngIf="!cargando && citasFuturas.length > 0" class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Paciente</th>
                      <th>Tipo de Consulta</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let cita of citasFuturas">
                      <td><strong>{{ formatearFecha(cita.fechaHora) }}</strong></td>
                      <td>{{ formatearHora(cita.fechaHora) }}</td>
                      <td>
                        <i class="fas fa-user me-1"></i>
                        {{ cita.pacienteNombre || 'Sin especificar' }}
                      </td>
                      <td>{{ cita.tipoConsulta || 'Consulta general' }}</td>
                      <td>
                        <span class="badge" [ngClass]="getEstadoBadgeClass(cita.estado)">
                          {{ cita.estado || 'PROGRAMADA' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-info" 
                                (click)="verDetalles(cita)">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="error" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .table th {
      border-top: none;
      font-weight: 600;
    }
    .badge {
      font-size: 0.75em;
    }
  `]
})
export class DashboardDoctorComponent implements OnInit {
  todasLasCitas: any[] = [];
  citasHoy: any[] = [];
  citasFuturas: any[] = [];
  citasPendientes: any[] = [];
  citasCompletadas: any[] = [];
  cargando: boolean = false;
  error: string = '';

  private URL_BASE = 'http://localhost:8081/api';

  constructor(
    private http: HttpClient,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando = true;
    this.error = '';

    const doctorId = this.auth.obtenerDoctorId();

    if (!doctorId) {
      this.buscarDoctorPorCorreo();
      return;
    }

    // Cargar citas específicas del doctor
    this.http.get<any[]>(`${this.URL_BASE}/citas/doctor/${doctorId}`).subscribe({
      next: (citas) => {
        this.todasLasCitas = citas;
        this.procesarCitas();
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las citas. Verifica que el servidor esté funcionando.';
        this.cargando = false;
      }
    });
  }
  // Método alternativo para buscar doctor por correo
  buscarDoctorPorCorreo() {
    const correo = this.auth.obtenerCorreo();
    if (!correo) {
      this.error = 'No se pudo identificar al doctor logueado (sin correo)';
      this.cargando = false;
      return;
    }

    // Buscar doctor por correo
    this.http.get<any>(`${this.URL_BASE}/doctores/buscar?correo=${correo}`).subscribe({
      next: (doctor) => {
        if (doctor && doctor.id) {
          // Actualizar la información del usuario con el doctorId
          const usuario = this.auth.obtenerUsuario();
          usuario.doctorId = doctor.id;
          this.auth.guardarUsuario(usuario);

          // Ahora cargar las citas con el doctorId encontrado
          this.cargarCitasConId(doctor.id);
        } else {
          this.crearDoctorSiNoExiste();
        }
      },
      error: (error) => {
        this.crearDoctorSiNoExiste();
      }
    });
  }

  // Método auxiliar para cargar citas con un ID específico
  cargarCitasConId(doctorId: number) {
    this.http.get<any[]>(`${this.URL_BASE}/citas/doctor/${doctorId}`).subscribe({
      next: (citas) => {
        this.todasLasCitas = citas;
        this.procesarCitas();
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las citas. Verifica que el servidor esté funcionando.';
        this.cargando = false;
      }
    });
  }

  // Método para crear el doctor si no existe
  crearDoctorSiNoExiste() {
    console.log('🔧 Intentando crear/verificar doctor...');

    const correo = this.auth.obtenerCorreo();
    const requestBody = correo ? { correo: correo } : {};

    this.http.post<any>(`${this.URL_BASE}/doctores/init-data`, requestBody).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);

        if (response.doctor) {
          // Actualizar la información del usuario con el doctorId
          const usuario = this.auth.obtenerUsuario();
          usuario.doctorId = response.doctor.id;
          this.auth.guardarUsuario(usuario);

          console.log('✅ Usuario actualizado con doctorId:', response.doctor.id);

          // Intentar cargar citas nuevamente
          this.cargarCitas();
        }
      },
      error: (error) => {
        console.error('❌ Error al crear/verificar doctor:', error);
        this.error = 'Error al crear el doctor: ' + (error.error?.error || error.message);
        this.cargando = false;
      }
    });
  }

  private procesarCitas() {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000);

    this.citasHoy = this.todasLasCitas.filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return fechaCita >= inicioHoy && fechaCita < finHoy;
    });

    this.citasFuturas = this.todasLasCitas.filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return fechaCita >= finHoy;
    });

    this.citasPendientes = this.todasLasCitas.filter(cita =>
      cita.estado === 'PROGRAMADA' || cita.estado === 'CONFIRMADA'
    );

    this.citasCompletadas = this.todasLasCitas.filter(cita =>
      cita.estado === 'COMPLETADA'
    );
  }

  formatearHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearFecha(fechaHora: string): string {
    return new Date(fechaHora).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'COMPLETADA':
        return 'bg-success';
      case 'CONFIRMADA':
        return 'bg-info';
      case 'CANCELADA':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  marcarComoCompletada(cita: any) {
    // Implementar lógica para marcar cita como completada
    console.log('Marcando cita como completada:', cita);
    // TODO: Implementar endpoint en el backend
  }

  verDetalles(cita: any) {
    // Implementar lógica para ver detalles de la cita
    console.log('Ver detalles de cita:', cita);
    // TODO: Implementar modal o navegación a vista de detalles
  }
}
