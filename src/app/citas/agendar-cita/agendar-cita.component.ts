import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Doctor, DoctorService } from '../../services/doctor.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { CitaService } from '../cita.service';

interface HorarioOption {
  valor: string;
  texto: string;
}

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.scss'
})
export class AgendarCitaComponent implements OnInit {
  form: FormGroup;
  mensaje: string = '';
  error: string = '';
  isLoading: boolean = false;
  horariosDisponibles: string[] = [];
  cargandoHorarios: boolean = false;
  cargandoDoctores: boolean = false;
  fechaSeleccionada: string = '';
  doctorSeleccionado: number | null = null;

  // Nueva propiedad para días disponibles
  diasDisponibles: string[] = [];
  cargandoDias: boolean = false;

  doctores: Doctor[] = [];
  especialidades: string[] = [];

  // Horarios base para formateo de texto (mantenido para getHorarioTexto)
  private todosLosHorarios: HorarioOption[] = [
    { valor: '08:00', texto: '8:00 AM' },
    { valor: '09:00', texto: '9:00 AM' },
    { valor: '10:00', texto: '10:00 AM' },
    { valor: '11:00', texto: '11:00 AM' },
    { valor: '14:00', texto: '2:00 PM' },
    { valor: '15:00', texto: '3:00 PM' },
    { valor: '16:00', texto: '4:00 PM' },
    { valor: '17:00', texto: '5:00 PM' }
  ];

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService,
    public auth: AuthService
  ) {
    // Configurar formulario según el rol del usuario
    const formConfig: any = {
      especialidad: [''],
      doctorId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivoConsulta: [''] // Campo opcional
    };

    // Si es asistente, agregar campos para correo y nombre del paciente
    if (this.auth.esAsistente()) {
      formConfig.correoPaciente = ['', [Validators.required, Validators.email]];
      formConfig.nombrePaciente = ['', Validators.required];
    }

    this.form = this.fb.group(formConfig);
  }

  ngOnInit() {
    this.cargarEspecialidades();
    this.cargarDoctores();
    this.configurarObservadores();
  }

  cargarEspecialidades() {
    console.log('🔄 Cargando especialidades desde el backend...');

    this.especialidadService.obtenerNombresEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
        console.log('✅ Especialidades cargadas desde backend:', this.especialidades);

        if (this.especialidades.length === 0) {
          console.log('ℹ️ No hay especialidades registradas en el sistema');
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar especialidades desde backend:', error);
        this.especialidades = [];
        this.error = 'No se pudieron cargar las especialidades. Por favor, verifica que haya especialidades registradas en el sistema.';
      }
    });
  }

  cargarDoctores() {
    this.cargandoDoctores = true;
    console.log('🔄 Cargando doctores desde el backend...');

    this.doctorService.obtenerDoctoresActivos().subscribe({
      next: (doctores: Doctor[]) => {
        this.doctores = doctores;
        this.cargandoDoctores = false;
        console.log('✅ Doctores cargados desde backend:', this.doctores);

        if (this.doctores.length === 0) {
          console.log('ℹ️ No hay doctores registrados en el sistema');
        }
      },
      error: (error: any) => {
        console.error('❌ Error al cargar doctores desde backend:', error);
        this.doctores = [];
        this.cargandoDoctores = false;
        this.error = 'No se pudieron cargar los doctores. Por favor, verifica que haya doctores registrados en el sistema.';
      }
    });
  }

  filtrarDoctoresPorEspecialidad(especialidad: string) {
    this.cargandoDoctores = true;
    this.doctorService.buscarPorEspecialidad(especialidad).subscribe({
      next: (doctores) => {
        this.doctores = doctores;
        this.cargandoDoctores = false;
        console.log('✅ Doctores filtrados por especialidad:', doctores);
      },
      error: (error) => {
        console.error('❌ Error al filtrar doctores:', error);
        this.cargandoDoctores = false;
        this.cargarDoctores(); // Cargar todos si falla
      }
    });
  }

  configurarObservadores() {
    // Observar cambios en la especialidad para filtrar doctores
    this.form.get('especialidad')?.valueChanges.subscribe(especialidad => {
      if (especialidad) {
        this.filtrarDoctoresPorEspecialidad(especialidad);
      } else {
        this.cargarDoctores();
      }
      // Limpiar doctor seleccionado cuando cambia la especialidad
      this.form.get('doctorId')?.setValue('');
      this.doctorSeleccionado = null;
      this.horariosDisponibles = [];
    });

    // Observar cambios en el doctor para cargar horarios
    this.form.get('doctorId')?.valueChanges.subscribe(doctorId => {
      this.doctorSeleccionado = doctorId ? parseInt(doctorId) : null;
      if (this.doctorSeleccionado) {
        // Cargar días disponibles cuando se selecciona un doctor
        this.cargarDiasDisponibles();

        if (this.fechaSeleccionada) {
          this.cargarHorariosDisponibles(this.fechaSeleccionada);
        }
      } else {
        this.horariosDisponibles = [];
        this.diasDisponibles = [];
      }
      // Limpiar hora seleccionada cuando cambia el doctor
      this.form.get('hora')?.setValue('');
      // Limpiar fecha cuando cambia el doctor para forzar nueva selección
      this.form.get('fecha')?.setValue('');
      this.fechaSeleccionada = '';
    });

    // Observar cambios en la fecha para cargar horarios disponibles
    this.form.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha && fecha !== this.fechaSeleccionada) {
        this.fechaSeleccionada = fecha;
        if (this.doctorSeleccionado) {
          this.cargarHorariosDisponibles(fecha);
        }
        // Limpiar la hora seleccionada cuando cambia la fecha
        this.form.get('hora')?.setValue('');
      }
    });
  }

  cargarHorariosDisponibles(fecha: string) {
    if (!this.doctorSeleccionado) return;

    this.cargandoHorarios = true;
    this.doctorService.obtenerHorariosDisponibles(this.doctorSeleccionado, fecha).subscribe({
      next: (horasDisponibles) => {
        this.horariosDisponibles = horasDisponibles;
        this.cargandoHorarios = false;
        console.log('✅ Horarios disponibles:', horasDisponibles);
      },
      error: (error) => {
        console.error('❌ Error al cargar horarios:', error);
        this.horariosDisponibles = [];
        this.cargandoHorarios = false;
      }
    });
  }

  cargarDiasDisponibles() {
    if (!this.doctorSeleccionado) return;

    this.cargandoDias = true;
    this.doctorService.obtenerDiasDisponibles(this.doctorSeleccionado).subscribe({
      next: (response: any) => {
        this.diasDisponibles = response.diasDisponibles || [];
        this.cargandoDias = false;
        console.log('✅ Días disponibles:', this.diasDisponibles);
      },
      error: (error) => {
        console.error('❌ Error al cargar días disponibles:', error);
        this.diasDisponibles = [];
        this.cargandoDias = false;
      }
    });
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.invalid || this.isLoading) return;

    const { doctorId, fecha, hora, motivoConsulta, correoPaciente, nombrePaciente } = this.form.value;
    const correoUsuario = this.auth.obtenerCorreo();

    if (!correoUsuario) {
      this.error = 'No se puede identificar al usuario. Por favor, inicie sesión nuevamente.';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.mensaje = '';

    // Preparar datos de la cita según el formato esperado por el backend
    const solicitudCita = {
      doctorId: parseInt(doctorId),
      fecha,
      hora,
      motivoConsulta: motivoConsulta || '', // Enviar string vacío si no hay motivo
      // SIEMPRE incluir el correo del paciente
      correoPaciente: this.auth.esAsistente() && correoPaciente ? correoPaciente : correoUsuario,
      nombrePaciente: this.auth.esAsistente() && nombrePaciente ? nombrePaciente : this.auth.obtenerUsuario()?.nombre || 'Usuario'
    };

    console.log('📅 Enviando solicitud de cita:', solicitudCita);

    this.citaService.agendarCita(solicitudCita).subscribe({
      next: (response: any) => {
        this.mensaje = response.mensaje || '¡Cita agendada exitosamente!';
        this.form.reset();
        this.horariosDisponibles = [];
        this.fechaSeleccionada = '';
        this.doctorSeleccionado = null;
        this.isLoading = false;

        console.log('✅ Cita agendada:', response);

        // Scroll hacia arriba para mostrar el mensaje
        window.scrollTo(0, 0);
      },
      error: (error) => {
        console.error('❌ Error al agendar cita:', error);
        this.error = this.formatearErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private formatearErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Error de conexión con el servidor. Verifique que el backend esté funcionando.';
    } else if (error.status === 401) {
      return 'Token de autenticación inválido. Por favor, inicie sesión nuevamente.';
    } else if (error.status === 403) {
      return 'No tiene permisos para agendar citas.';
    } else if (error.status >= 500) {
      return 'Error interno del servidor.';
    } else if (error.error?.message) {
      return error.error.message;
    } else if (error.error?.error) {
      return error.error.error;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Error al agendar la cita. Intente nuevamente.';
    }
  }

  getHorarioTexto(hora: string): string {
    const horarioOption = this.todosLosHorarios.find(h => h.valor === hora);
    if (horarioOption) {
      return horarioOption.texto;
    }

    // Fallback: convertir formato HH:mm a formato legible
    const [horas, minutos] = hora.split(':');
    const horaNum = parseInt(horas);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
    return `${hora12}:${minutos} ${ampm}`;
  }

  obtenerDoctorSeleccionado(): Doctor | null {
    return this.doctores.find(d => d.id === this.doctorSeleccionado) || null;
  }
}
