import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Doctor, DoctorService } from '../services/doctor.service';
import { Especialidad, EspecialidadService } from '../services/especialidad.service';

@Component({
    selector: 'app-admin-setup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="admin-setup-container">
      <div class="header">
        <h1>📋 Panel de Administración</h1>
        <p class="subtitle">Gestión de doctores y especialidades del sistema</p>
      </div>

      <!-- Estado del Sistema -->
      <div class="estado-sistema">
        <h3>🔍 Estado del Sistema</h3>
        <div class="stats">
          <div class="stat-card">
            <span class="stat-number">{{especialidades.length}}</span>
            <span class="stat-label">Especialidades</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{doctores.length}}</span>
            <span class="stat-label">Doctores</span>
          </div>
        </div>
      </div>

      <!-- Sección de Especialidades -->
      <div class="seccion">
        <h3>🏥 Gestión de Especialidades</h3>
        
        <div class="form-container">
          <h4>➕ Agregar Nueva Especialidad</h4>
          <form (ngSubmit)="agregarEspecialidad()" class="form">
            <div class="form-group">
              <label for="nombreEspecialidad">Nombre de la Especialidad:</label>
              <input 
                type="text" 
                id="nombreEspecialidad"
                [(ngModel)]="nuevaEspecialidad.nombre" 
                name="nombreEspecialidad"
                placeholder="Ej: Cardiología"
                required>
            </div>
            <div class="form-group">
              <label for="descripcionEspecialidad">Descripción:</label>
              <textarea 
                id="descripcionEspecialidad"
                [(ngModel)]="nuevaEspecialidad.descripcion" 
                name="descripcionEspecialidad"
                placeholder="Descripción de la especialidad"
                rows="3"
                required></textarea>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!nuevaEspecialidad.nombre.trim()">
              ➕ Agregar Especialidad
            </button>
          </form>
        </div>

        <!-- Lista de Especialidades -->
        <div class="lista-container" *ngIf="especialidades.length > 0">
          <h4>📝 Especialidades Registradas</h4>
          <div class="lista-items">
            <div *ngFor="let especialidad of especialidades" class="item-card">
              <div class="item-info">
                <h5>{{especialidad.nombre}}</h5>
                <p>{{especialidad.descripcion}}</p>
                <span class="estado" [class.activa]="especialidad.activa">
                  {{especialidad.activa ? '✅ Activa' : '❌ Inactiva'}}
                </span>
              </div>
              <div class="item-actions">
                <button (click)="toggleEspecialidadEstado(especialidad)" class="btn-toggle">
                  {{especialidad.activa ? 'Desactivar' : 'Activar'}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Doctores -->
      <div class="seccion">
        <h3>👨‍⚕️ Gestión de Doctores</h3>
        
        <div class="form-container">
          <h4>➕ Agregar Nuevo Doctor</h4>
          <form (ngSubmit)="agregarDoctor()" class="form">
            <div class="form-group">
              <label for="nombreDoctor">Nombre Completo:</label>
              <input 
                type="text" 
                id="nombreDoctor"
                [(ngModel)]="nuevoDoctor.nombre" 
                name="nombreDoctor"
                placeholder="Ej: Dr. Juan Pérez"
                required>
            </div>
            <div class="form-group">
              <label for="correoDoctor">Correo Electrónico:</label>
              <input 
                type="email" 
                id="correoDoctor"
                [(ngModel)]="nuevoDoctor.correo" 
                name="correoDoctor"
                placeholder="doctor@hospital.com"
                required>
            </div>
            <div class="form-group">
              <label for="passwordDoctor">Contraseña:</label>
              <input 
                type="password" 
                id="passwordDoctor"
                [(ngModel)]="nuevoDoctor.password" 
                name="passwordDoctor"
                placeholder="Contraseña para acceso al sistema"
                minlength="6"
                required>
              <small class="password-hint">Mínimo 6 caracteres. El doctor usará esta contraseña para iniciar sesión.</small>
            </div>
            <div class="form-group">
              <label for="telefonoDoctor">Teléfono:</label>
              <input 
                type="tel" 
                id="telefonoDoctor"
                [(ngModel)]="nuevoDoctor.telefono" 
                name="telefonoDoctor"
                placeholder="Ej: +1234567890">
            </div>
            <div class="form-group">
              <label for="especialidadDoctor">Especialidad:</label>
              <select 
                id="especialidadDoctor"
                [(ngModel)]="nuevoDoctor.especialidad" 
                name="especialidadDoctor"
                required>
                <option value="">Seleccione una especialidad</option>
                <option *ngFor="let esp of especialidades" [value]="esp.nombre">
                  {{esp.nombre}}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="licenciaDoctor">Número de Licencia:</label>
              <input 
                type="text" 
                id="licenciaDoctor"
                [(ngModel)]="nuevoDoctor.numeroLicencia" 
                name="licenciaDoctor"
                placeholder="Ej: LIC-12345"
                required>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!esDoctorValido()">
              👨‍⚕️ Agregar Doctor
            </button>
          </form>
        </div>

        <!-- Lista de Doctores -->
        <div class="lista-container" *ngIf="doctores.length > 0">
          <h4>👥 Doctores Registrados</h4>
          <div class="lista-items">
            <div *ngFor="let doctor of doctores" class="item-card">
              <div class="item-info">
                <h5>{{doctor.nombre}}</h5>
                <p><strong>Especialidad:</strong> {{doctor.especialidad}}</p>
                <p><strong>Correo:</strong> {{doctor.correo}}</p>
                <p><strong>Teléfono:</strong> {{doctor.telefono}}</p>
                <p><strong>Licencia:</strong> {{doctor.numeroLicencia}}</p>
                <span class="estado" [class.activo]="doctor.estado === 'ACTIVO'">
                  {{doctor.estado === 'ACTIVO' ? '✅ Activo' : '❌ Inactivo'}}
                </span>
              </div>
              <div class="item-actions">
                <button (click)="toggleDoctorEstado(doctor)" class="btn-toggle">
                  {{doctor.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes -->
      <div *ngIf="mensaje" class="mensaje" [class.error]="esError" [class.exito]="!esError">
        {{mensaje}}
      </div>
    </div>
  `,
    styles: [`
    .admin-setup-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    .subtitle {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }

    .estado-sistema {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .stats {
      display: flex;
      gap: 20px;
      justify-content: center;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 120px;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 0.9rem;
    }

    .seccion {
      background: white;
      margin-bottom: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .seccion h3 {
      background: #667eea;
      color: white;
      margin: 0;
      padding: 15px 20px;
      font-size: 1.3rem;
    }

    .form-container {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .form {
      display: grid;
      gap: 15px;
      max-width: 600px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 10px;
      border: 2px solid #e1e5e9;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }

    .password-hint {
      color: #666;
      font-size: 0.85rem;
      margin-top: 5px;
      font-style: italic;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .lista-container {
      padding: 20px;
    }

    .lista-items {
      display: grid;
      gap: 15px;
    }

    .item-card {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 15px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: #fafafa;
    }

    .item-info h5 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .item-info p {
      margin: 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .estado {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
      margin-top: 10px;
    }

    .estado.activa,
    .estado.activo {
      background: #d4edda;
      color: #155724;
    }

    .estado:not(.activa):not(.activo) {
      background: #f8d7da;
      color: #721c24;
    }

    .btn-toggle {
      background: #ffc107;
      color: #212529;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-toggle:hover {
      background: #e0a800;
    }

    .mensaje {
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
      font-weight: 600;
    }

    .mensaje.exito {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .mensaje.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .admin-setup-container {
        padding: 10px;
      }

      .stats {
        flex-direction: column;
        align-items: center;
      }

      .item-card {
        flex-direction: column;
        gap: 15px;
      }

      .item-actions {
        align-self: flex-start;
      }
    }
  `]
})
export class AdminSetupComponent implements OnInit {
    especialidades: Especialidad[] = [];
    doctores: Doctor[] = [];

    nuevaEspecialidad = {
        nombre: '',
        descripcion: ''
    };

    nuevoDoctor = {
        nombre: '',
        correo: '',
        password: '',
        telefono: '',
        especialidad: '',
        numeroLicencia: '',
        estado: 'ACTIVO'
    };

    mensaje: string = '';
    esError: boolean = false;

    constructor(
        private especialidadService: EspecialidadService,
        private doctorService: DoctorService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.cargarDatos();
    }

    cargarDatos() {
        this.cargarEspecialidades();
        this.cargarDoctores();
    }

    cargarEspecialidades() {
        this.especialidadService.obtenerTodasLasEspecialidades().subscribe({
            next: (especialidades) => {
                this.especialidades = especialidades;
                console.log('✅ Especialidades cargadas:', especialidades.length);
            },
            error: (error) => {
                console.error('❌ Error al cargar especialidades:', error);
                this.mostrarMensaje('Error al cargar especialidades', true);
            }
        });
    }

    cargarDoctores() {
        // Usamos el endpoint público para obtener todos los doctores
        this.http.get<Doctor[]>('http://localhost:8081/api/public/doctores').subscribe({
            next: (doctores) => {
                this.doctores = doctores;
                console.log('✅ Doctores cargados:', doctores.length);
            },
            error: (error) => {
                console.error('❌ Error al cargar doctores:', error);
                this.mostrarMensaje('Error al cargar doctores', true);
            }
        });
    }

    agregarEspecialidad() {
        if (!this.nuevaEspecialidad.nombre.trim()) {
            this.mostrarMensaje('El nombre de la especialidad es requerido', true);
            return;
        }

        const especialidad = {
            nombre: this.nuevaEspecialidad.nombre.trim(),
            descripcion: this.nuevaEspecialidad.descripcion.trim(),
            activa: true
        };

        this.http.post<Especialidad>('http://localhost:8081/api/especialidades', especialidad).subscribe({
            next: (nuevaEsp) => {
                this.especialidades.push(nuevaEsp);
                this.nuevaEspecialidad = { nombre: '', descripcion: '' };
                this.mostrarMensaje('✅ Especialidad agregada exitosamente', false);
            },
            error: (error) => {
                console.error('❌ Error al agregar especialidad:', error);
                this.mostrarMensaje('Error al agregar especialidad', true);
            }
        });
    }

    agregarDoctor() {
        if (!this.esDoctorValido()) {
            this.mostrarMensaje('Por favor complete todos los campos requeridos', true);
            return;
        }

        const doctor = {
            nombre: this.nuevoDoctor.nombre.trim(),
            correo: this.nuevoDoctor.correo.trim(),
            password: this.nuevoDoctor.password.trim(),
            telefono: this.nuevoDoctor.telefono.trim(),
            especialidad: this.nuevoDoctor.especialidad,
            numeroLicencia: this.nuevoDoctor.numeroLicencia.trim()
        };

        this.http.post<any>('http://localhost:8081/api/admin/doctores', doctor).subscribe({
            next: (response) => {
                // Convertir la respuesta al formato esperado por la interfaz
                const nuevoDoc: Doctor = {
                    id: response.id,
                    nombre: response.nombre,
                    correo: response.correo,
                    especialidad: response.especialidad,
                    telefono: response.telefono,
                    numeroLicencia: response.numeroLicencia,
                    estado: response.estado
                };

                this.doctores.push(nuevoDoc);
                this.nuevoDoctor = {
                    nombre: '',
                    correo: '',
                    password: '',
                    telefono: '',
                    especialidad: '',
                    numeroLicencia: '',
                    estado: 'ACTIVO'
                };
                this.mostrarMensaje('✅ Doctor agregado exitosamente', false);
            },
            error: (error) => {
                console.error('❌ Error al agregar doctor:', error);
                this.mostrarMensaje(`Error al agregar doctor: ${error.error?.error || error.message}`, true);
            }
        });
    }

    esDoctorValido(): boolean {
        return !!(
            this.nuevoDoctor.nombre.trim() &&
            this.nuevoDoctor.correo.trim() &&
            this.nuevoDoctor.password.trim() &&
            this.nuevoDoctor.password.length >= 6 &&
            this.nuevoDoctor.especialidad &&
            this.nuevoDoctor.numeroLicencia.trim()
        );
    }

    toggleEspecialidadEstado(especialidad: Especialidad) {
        // Aquí implementarías la lógica para cambiar el estado de la especialidad
        this.mostrarMensaje('Funcionalidad de cambio de estado pendiente de implementar', true);
    }

    toggleDoctorEstado(doctor: Doctor) {
        // Aquí implementarías la lógica para cambiar el estado del doctor
        this.mostrarMensaje('Funcionalidad de cambio de estado pendiente de implementar', true);
    }

    mostrarMensaje(texto: string, esError: boolean) {
        this.mensaje = texto;
        this.esError = esError;
        setTimeout(() => {
            this.mensaje = '';
        }, 5000);
    }
}
