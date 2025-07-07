import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { HorarioDoctor, HorarioService } from '../../services/horario.service';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="fas fa-calendar-alt"></i> Gestionar Mis Horarios
          </h2>
        </div>
      </div>

      <!-- Formulario para crear/editar horario -->
      <div class="row mb-4">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="fas fa-plus"></i> 
                {{ modoEdicion ? 'Editar Horario' : 'Nuevo Horario' }}
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="horarioForm" (ngSubmit)="guardarHorario()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Día de la semana</label>
                    <select class="form-select" formControlName="dia">
                      <option value="">Seleccionar día</option>
                      <option value="MONDAY">Lunes</option>
                      <option value="TUESDAY">Martes</option>
                      <option value="WEDNESDAY">Miércoles</option>
                      <option value="THURSDAY">Jueves</option>
                      <option value="FRIDAY">Viernes</option>
                      <option value="SATURDAY">Sábado</option>
                      <option value="SUNDAY">Domingo</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Duración por cita (minutos)</label>
                    <select class="form-select" formControlName="duracionCita">
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Hora de inicio</label>
                    <input type="time" class="form-control" formControlName="horaInicio">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Hora de fin</label>
                    <input type="time" class="form-control" formControlName="horaFin">
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!horarioForm.valid || cargando">
                    <i class="fas fa-save"></i>
                    {{ modoEdicion ? 'Actualizar' : 'Crear' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelarEdicion()" *ngIf="modoEdicion">
                    <i class="fas fa-times"></i> Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Vista previa de horarios de la semana -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">
                <i class="fas fa-calendar-week"></i> Vista Semanal
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Horario</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let dia of diasSemana">
                      <td>{{ dia.nombre }}</td>
                      <td>
                        <div *ngFor="let horario of obtenerHorariosPorDia(dia.valor)" class="small">
                          {{ horario.horaInicio }} - {{ horario.horaFin }}
                          <span class="badge bg-secondary ms-1">{{ horario.duracionCita }}min</span>
                        </div>
                        <span *ngIf="obtenerHorariosPorDia(dia.valor).length === 0" class="text-muted">
                          Sin horarios
                        </span>
                      </td>
                      <td>
                        <span *ngFor="let horario of obtenerHorariosPorDia(dia.valor)" 
                              [class]="'badge me-1 ' + obtenerClasseEstado(horario.estado)">
                          {{ horario.estado }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de horarios detallada -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0">
                <i class="fas fa-list"></i> Mis Horarios Configurados
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="cargandoHorarios" class="text-center">
                <div class="spinner-border" role="status"></div>
                <p>Cargando horarios...</p>
              </div>

              <div *ngIf="!cargandoHorarios && horarios.length === 0" class="text-center text-muted">
                <i class="fas fa-calendar-times fa-3x mb-3"></i>
                <h5>No tienes horarios configurados</h5>
                <p>Comienza agregando tu primer horario de atención</p>
              </div>

              <div *ngIf="!cargandoHorarios && horarios.length > 0">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-dark">
                      <tr>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Duración</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let horario of horarios">
                        <td>
                          <i class="fas fa-calendar-day me-2"></i>
                          {{ obtenerNombreDia(horario.dia) }}
                        </td>
                        <td>
                          <strong>{{ horario.horaInicio }} - {{ horario.horaFin }}</strong>
                        </td>
                        <td>
                          <span class="badge bg-info">{{ horario.duracionCita }} min</span>
                        </td>
                        <td>
                          <span [class]="'badge ' + obtenerClasseEstado(horario.estado)">
                            {{ horario.estado }}
                          </span>
                        </td>
                        <td>
                          <small class="text-muted">{{ horario.observaciones || '-' }}</small>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" 
                                    (click)="editarHorario(horario)"
                                    title="Editar">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-warning" 
                                    (click)="toggleEstadoHorario(horario)"
                                    [title]="horario.estado === 'ACTIVO' ? 'Bloquear' : 'Activar'">
                              <i [class]="horario.estado === 'ACTIVO' ? 'fas fa-lock' : 'fas fa-unlock'"></i>
                            </button>
                            <button class="btn btn-outline-danger" 
                                    (click)="eliminarHorario(horario)"
                                    title="Eliminar">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div *ngIf="mensaje" class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="fas fa-check-circle"></i> {{ mensaje }}
        <button type="button" class="btn-close" (click)="mensaje = ''"></button>
      </div>

      <div *ngIf="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
        <button type="button" class="btn-close" (click)="error = ''"></button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
    
    .table th {
      border-top: none;
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    .badge {
      font-size: 0.75em;
    }
  `]
})
export class GestionarHorariosComponent implements OnInit {
  horarioForm: FormGroup;
  horarios: HorarioDoctor[] = [];
  cargandoHorarios = false;
  cargando = false;
  mensaje = '';
  error = '';
  modoEdicion = false;
  horarioEditando?: HorarioDoctor;
  doctorId?: number;

  diasSemana = [
    { valor: 'MONDAY', nombre: 'Lunes' },
    { valor: 'TUESDAY', nombre: 'Martes' },
    { valor: 'WEDNESDAY', nombre: 'Miércoles' },
    { valor: 'THURSDAY', nombre: 'Jueves' },
    { valor: 'FRIDAY', nombre: 'Viernes' },
    { valor: 'SATURDAY', nombre: 'Sábado' },
    { valor: 'SUNDAY', nombre: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.horarioForm = this.fb.group({
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      duracionCita: [30, [Validators.required, Validators.min(15), Validators.max(120)]]
    });
  }

  ngOnInit() {
    this.obtenerDoctorId().then(() => {
      this.cargarHorarios();
    });
  }

  async obtenerDoctorId() {
    const correoDoctor = this.auth.obtenerCorreo();
    if (!correoDoctor) {
      this.error = 'No se pudo identificar al doctor logueado';
      return;
    }

    try {
      const doctores = await this.http.get<any[]>('http://localhost:8081/api/doctores').toPromise();
      const doctor = doctores?.find(d => d.correo === correoDoctor);
      if (doctor) {
        this.doctorId = doctor.id;
        console.log('✅ Doctor ID encontrado:', this.doctorId);
      } else {
        this.error = 'Doctor no encontrado en el sistema';
      }
    } catch (error) {
      console.error('❌ Error al obtener ID del doctor:', error);
      this.error = 'Error al obtener información del doctor';
    }
  }

  cargarHorarios() {
    if (!this.doctorId) {
      this.error = 'ID del doctor no disponible';
      return;
    }

    this.cargandoHorarios = true;

    this.horarioService.obtenerHorariosPorDoctor(this.doctorId)
      .subscribe({
        next: (horarios: HorarioDoctor[]) => {
          this.horarios = horarios;
          this.cargandoHorarios = false;
          console.log('✅ Horarios cargados del backend:', horarios);
        },
        error: (err: any) => {
          console.error('❌ Error al cargar horarios:', err);
          this.error = 'Error al cargar horarios: ' + (err.error?.message || err.message);
          this.cargandoHorarios = false;
        }
      });
  }

  guardarHorario() {
    if (!this.horarioForm.valid || !this.doctorId) return;

    this.cargando = true;
    const datosHorario = {
      ...this.horarioForm.value,
      doctorId: this.doctorId
    };

    const request = this.modoEdicion
      ? this.horarioService.actualizarHorario(this.horarioEditando!.id!, datosHorario)
      : this.horarioService.crearHorario(datosHorario);

    request.subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del servidor:', response);
        this.mensaje = this.modoEdicion ? 'Horario actualizado correctamente' : 'Horario creado correctamente';
        this.horarioForm.reset({ duracionCita: 30 });
        this.cargarHorarios();
        this.cancelarEdicion();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error al guardar horario:', err);
        this.error = err.error?.message || 'Error al guardar el horario';
        this.cargando = false;
      }
    });
  }

  editarHorario(horario: HorarioDoctor) {
    this.modoEdicion = true;
    this.horarioEditando = horario;
    this.horarioForm.patchValue({
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracionCita: horario.duracionCita
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.horarioEditando = undefined;
    this.horarioForm.reset({ duracionCita: 30 });
  }

  toggleEstadoHorario(horario: HorarioDoctor) {
    const activar = horario.estado !== 'ACTIVO';
    const motivo = activar ? undefined : 'Bloqueado temporalmente';

    this.horarioService.toggleEstadoHorario(horario.id!, activar, motivo).subscribe({
      next: () => {
        this.mensaje = `Horario ${activar ? 'activado' : 'bloqueado'} correctamente`;
        this.cargarHorarios();
      },
      error: (err: any) => {
        this.error = err.error?.error || `Error al ${activar ? 'activar' : 'bloquear'} el horario`;
      }
    });
  }

  eliminarHorario(horario: HorarioDoctor) {
    if (!confirm('¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.')) {
      return;
    }

    this.horarioService.eliminarHorario(horario.id!).subscribe({
      next: () => {
        this.mensaje = 'Horario eliminado correctamente';
        this.cargarHorarios();
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Error al eliminar el horario';
      }
    });
  }

  obtenerHorariosPorDia(dia: string): HorarioDoctor[] {
    return this.horarios.filter(h => h.dia === dia);
  }

  obtenerNombreDia(dia: string): string {
    const diaEncontrado = this.diasSemana.find(d => d.valor === dia);
    return diaEncontrado?.nombre || dia;
  }

  obtenerClasseEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'bg-success';
      case 'BLOQUEADO': return 'bg-warning';
      case 'INACTIVO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
