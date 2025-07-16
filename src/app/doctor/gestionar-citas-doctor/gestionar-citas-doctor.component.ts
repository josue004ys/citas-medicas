import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

interface Doctor {
    id: number;
    nombre: string;
    especialidad: string;
    correo: string;
}

@Component({
    selector: 'app-gestionar-citas-doctor',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './gestionar-citas-doctor.component.html',
    styleUrl: './gestionar-citas-doctor.component.scss'
})
export class GestionarCitasDoctorComponent implements OnInit {
    citas: Cita[] = [];
    doctoresDisponibles: Doctor[] = [];
    citaSeleccionada: Cita | null = null;

    reprogramarForm: FormGroup;
    cancelarForm: FormGroup;
    reasignarForm: FormGroup;

    mostrarModalReprogramar = false;
    mostrarModalCancelar = false;
    mostrarModalReasignar = false;
    mostrarModalHistorial = false;

    historialCita: any[] = [];
    isLoading = false;
    mensaje = '';
    error = '';

    private URL_BASE = 'http://localhost:8081/api';

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.reprogramarForm = this.fb.group({
            nuevaFecha: ['', Validators.required],
            nuevaHora: ['', Validators.required],
            motivo: ['', Validators.required],
            mensajePaciente: ['', Validators.required]
        });

        this.cancelarForm = this.fb.group({
            motivo: ['', Validators.required],
            mensajePaciente: ['', Validators.required]
        });

        this.reasignarForm = this.fb.group({
            nuevoDoctorId: ['', Validators.required],
            motivo: ['', Validators.required],
            mensajePaciente: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.cargarCitas();
    }

    cargarCitas(): void {
        const doctorId = this.auth.obtenerDoctorId();
        if (!doctorId) {
            this.error = 'No se pudo identificar al doctor.';
            return;
        }

        this.isLoading = true;
        this.http.get<Cita[]>(`${this.URL_BASE}/citas/doctor/${doctorId}`).subscribe({
            next: (citas) => {
                this.citas = citas.filter(cita =>
                    cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'
                );
                this.isLoading = false;
            },
            error: (error) => {
                this.error = 'Error al cargar las citas';
                this.isLoading = false;
            }
        });
    }

    // ========= REPROGRAMAR CITA =========
    abrirModalReprogramar(cita: Cita): void {
        this.citaSeleccionada = cita;
        this.mostrarModalReprogramar = true;

        // Establecer fecha mínima (mañana)
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const fechaMinima = mañana.toISOString().split('T')[0];

        this.reprogramarForm.patchValue({
            nuevaFecha: fechaMinima
        });
    }

    reprogramarCita(): void {
        if (this.reprogramarForm.valid && this.citaSeleccionada) {
            this.isLoading = true;

            const datos = {
                ...this.reprogramarForm.value,
                citaId: this.citaSeleccionada.id
            };

            this.http.put(`${this.URL_BASE}/citas/${this.citaSeleccionada.id}/reprogramar`, datos)
                .subscribe({
                    next: (response: any) => {
                        this.mensaje = 'Cita reprogramada exitosamente. El paciente ha sido notificado.';
                        this.cerrarModales();
                        this.cargarCitas();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Error al reprogramar:', error);
                        this.error = 'Error al reprogramar la cita: ' + (error.error?.error || error.message);
                        this.isLoading = false;
                    }
                });
        }
    }

    // ========= CANCELAR CITA =========
    abrirModalCancelar(cita: Cita): void {
        this.citaSeleccionada = cita;
        this.mostrarModalCancelar = true;
    }

    cancelarCita(): void {
        if (this.cancelarForm.valid && this.citaSeleccionada) {
            this.isLoading = true;

            const datos = this.cancelarForm.value;

            this.http.put(`${this.URL_BASE}/citas/${this.citaSeleccionada.id}/cancelar-doctor`, datos)
                .subscribe({
                    next: (response: any) => {
                        this.mensaje = 'Cita cancelada exitosamente. El paciente ha sido notificado.';
                        this.cerrarModales();
                        this.cargarCitas();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Error al cancelar:', error);
                        this.error = 'Error al cancelar la cita: ' + (error.error?.error || error.message);
                        this.isLoading = false;
                    }
                });
        }
    }

    // ========= REASIGNAR CITA =========
    abrirModalReasignar(cita: Cita): void {
        this.citaSeleccionada = cita;
        this.cargarDoctoresDisponibles(cita.id);
        this.mostrarModalReasignar = true;
    }

    cargarDoctoresDisponibles(citaId: number): void {
        this.http.get<Doctor[]>(`${this.URL_BASE}/citas/${citaId}/doctores-disponibles`)
            .subscribe({
                next: (doctores) => {
                    this.doctoresDisponibles = doctores;
                },
                error: (error) => {
                    console.error('Error al cargar doctores:', error);
                    this.error = 'Error al cargar doctores disponibles';
                }
            });
    }

    reasignarCita(): void {
        if (this.reasignarForm.valid && this.citaSeleccionada) {
            this.isLoading = true;

            const datos = this.reasignarForm.value;

            this.http.put(`${this.URL_BASE}/citas/${this.citaSeleccionada.id}/reasignar`, datos)
                .subscribe({
                    next: (response: any) => {
                        this.mensaje = `Cita reasignada exitosamente al Dr. ${response.nuevoDoctor}. El paciente ha sido notificado.`;
                        this.cerrarModales();
                        this.cargarCitas();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Error al reasignar:', error);
                        this.error = 'Error al reasignar la cita: ' + (error.error?.error || error.message);
                        this.isLoading = false;
                    }
                });
        }
    }

    // ========= HISTORIAL =========
    verHistorial(cita: Cita): void {
        this.citaSeleccionada = cita;
        this.mostrarModalHistorial = true;

        this.http.get<any[]>(`${this.URL_BASE}/citas/${cita.id}/historial`)
            .subscribe({
                next: (historial) => {
                    this.historialCita = historial;
                },
                error: (error) => {
                    console.error('Error al cargar historial:', error);
                    this.error = 'Error al cargar el historial';
                }
            });
    }

    // ========= UTILIDADES =========
    cerrarModales(): void {
        this.mostrarModalReprogramar = false;
        this.mostrarModalCancelar = false;
        this.mostrarModalReasignar = false;
        this.mostrarModalHistorial = false;
        this.citaSeleccionada = null;
        this.reprogramarForm.reset();
        this.cancelarForm.reset();
        this.reasignarForm.reset();
    }

    // ========= CONFIRMAR CITA =========
    confirmarCita(cita: Cita): void {
        // Confirmar acción
        if (!confirm(`¿Está seguro de confirmar la cita con ${cita.pacienteNombre}?`)) {
            return;
        }

        this.isLoading = true;

        this.http.put(`${this.URL_BASE}/citas/${cita.id}/confirmar`, {})
            .subscribe({
                next: (response: any) => {
                    this.mensaje = `Cita confirmada exitosamente. El paciente ${cita.pacienteNombre} ha sido notificado.`;
                    this.cargarCitas();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error al confirmar cita:', error);
                    this.error = 'Error al confirmar la cita: ' + (error.error?.error || error.message);
                    this.isLoading = false;
                }
            });
    }

    // ========= MÉTODOS DE UTILIDAD =========
    formatDate(fechaHora: string): string {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(fechaHora: string): string {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getBadgeClass(estado: string): string {
        switch (estado) {
            case 'CONFIRMADA': return 'badge bg-success';
            case 'PENDIENTE': return 'badge bg-warning text-dark';
            case 'PROGRAMADA': return 'badge bg-info';
            case 'ATENDIDA': return 'badge bg-primary';
            case 'CANCELADA': return 'badge bg-danger';
            case 'NO_ASISTIO': return 'badge bg-secondary';
            default: return 'badge bg-secondary';
        }
    }

    limpiarMensajes(): void {
        this.mensaje = '';
        this.error = '';
    }
}
