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
        <p class="subtitle">Gestión integral del sistema de citas médicas</p>
      </div>

      <!-- Navegación por Pestañas -->
      <div class="tabs-container">
        <div class="tabs-nav">
          <button 
            class="tab-button" 
            [class.active]="pestanaActiva === 'dashboard'"
            (click)="cambiarPestana('dashboard')">
            📊 Dashboard
          </button>
          <button 
            class="tab-button" 
            [class.active]="pestanaActiva === 'especialidades'"
            (click)="cambiarPestana('especialidades')">
            🏥 Especialidades
          </button>
          <button 
            class="tab-button" 
            [class.active]="pestanaActiva === 'doctores'"
            (click)="cambiarPestana('doctores')">
            👨‍⚕️ Doctores
          </button>
          <button 
            class="tab-button" 
            [class.active]="pestanaActiva === 'agregar-doctor'"
            (click)="cambiarPestana('agregar-doctor')">
            ➕ Nuevo Doctor
          </button>
          <button 
            class="tab-button" 
            [class.active]="pestanaActiva === 'reportes'"
            (click)="cambiarPestana('reportes')">
            📊 Reportes
          </button>
        </div>

        <!-- Contenido de las Pestañas -->
        <div class="tab-content">
          
          <!-- Pestaña Dashboard -->
          <div *ngIf="pestanaActiva === 'dashboard'" class="tab-panel">
            <h2>🔍 Estado del Sistema</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">🏥</div>
                <div class="stat-info">
                  <span class="stat-number">{{especialidades.length}}</span>
                  <span class="stat-label">Especialidades Activas</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">👨‍⚕️</div>
                <div class="stat-info">
                  <span class="stat-number">{{doctores.length}}</span>
                  <span class="stat-label">Doctores Registrados</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <span class="stat-number">{{getDoctoresActivos()}}</span>
                  <span class="stat-label">Doctores Activos</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                  <span class="stat-number">{{getFechaActual()}}</span>
                  <span class="stat-label">Última Actualización</span>
                </div>
              </div>
            </div>
            
            <div class="quick-actions">
              <h3>⚡ Acciones Rápidas</h3>
              <div class="action-buttons">
                <button class="action-btn" (click)="cambiarPestana('agregar-doctor')">
                  ➕ Agregar Doctor
                </button>
                <button class="action-btn" (click)="cambiarPestana('especialidades')">
                  🏥 Gestionar Especialidades
                </button>
                <button class="action-btn" (click)="cargarDatos()">
                  🔄 Actualizar Datos
                </button>
              </div>
            </div>
          </div>

          <!-- Pestaña Especialidades -->
          <div *ngIf="pestanaActiva === 'especialidades'" class="tab-panel">
            <h2>🏥 Gestión de Especialidades</h2>
            
            <!-- Formulario para agregar especialidad -->
            <div class="form-section">
              <h3>➕ Agregar Nueva Especialidad</h3>
              <form (ngSubmit)="agregarEspecialidad()" class="inline-form">
                <div class="form-group">
                  <label for="nombreEspecialidad">Especialidad:</label>
                  <select 
                    id="nombreEspecialidad"
                    [(ngModel)]="nuevaEspecialidad.nombre" 
                    name="nombreEspecialidad"
                    required
                    class="especialidad-select">
                    <option value="">Seleccione una especialidad</option>
                    <optgroup label="🫀 Especialidades Médicas">
                      <option value="Cardiología">Cardiología</option>
                      <option value="Dermatología">Dermatología</option>
                      <option value="Endocrinología">Endocrinología</option>
                      <option value="Gastroenterología">Gastroenterología</option>
                      <option value="Geriatría">Geriatría</option>
                      <option value="Hematología">Hematología</option>
                      <option value="Medicina Interna">Medicina Interna</option>
                      <option value="Nefrología">Nefrología</option>
                      <option value="Neumología">Neumología</option>
                      <option value="Neurología">Neurología</option>
                      <option value="Oncología">Oncología</option>
                      <option value="Reumatología">Reumatología</option>
                    </optgroup>
                    <optgroup label="🏥 Especialidades Quirúrgicas">
                      <option value="Cirugía General">Cirugía General</option>
                      <option value="Cirugía Cardiovascular">Cirugía Cardiovascular</option>
                      <option value="Cirugía Plástica">Cirugía Plástica</option>
                      <option value="Neurocirugía">Neurocirugía</option>
                      <option value="Ortopedia">Ortopedia y Traumatología</option>
                      <option value="Urología">Urología</option>
                    </optgroup>
                    <optgroup label="👶 Especialidades Materno-Infantiles">
                      <option value="Ginecología">Ginecología y Obstetricia</option>
                      <option value="Pediatría">Pediatría</option>
                      <option value="Neonatología">Neonatología</option>
                    </optgroup>
                    <optgroup label="🧠 Especialidades de Salud Mental">
                      <option value="Psiquiatría">Psiquiatría</option>
                      <option value="Psicología">Psicología Clínica</option>
                    </optgroup>
                    <optgroup label="👁️ Especialidades de Órganos Sensoriales">
                      <option value="Oftalmología">Oftalmología</option>
                      <option value="Otorrinolaringología">Otorrinolaringología</option>
                    </optgroup>
                    <optgroup label="🩻 Especialidades Diagnósticas">
                      <option value="Radiología">Radiología</option>
                      <option value="Patología">Patología</option>
                      <option value="Medicina Nuclear">Medicina Nuclear</option>
                    </optgroup>
                    <optgroup label="🏃‍♂️ Otras Especialidades">
                      <option value="Medicina del Deporte">Medicina del Deporte</option>
                      <option value="Medicina del Trabajo">Medicina del Trabajo</option>
                      <option value="Medicina Familiar">Medicina Familiar</option>
                      <option value="Urgencias">Medicina de Urgencias</option>
                    </optgroup>
                  </select>
                </div>
                <button type="submit" class="btn-primary" [disabled]="!nuevaEspecialidad.nombre.trim()">
                  ➕ Agregar
                </button>
              </form>
            </div>

            <!-- Lista de Especialidades -->
            <div class="content-section" *ngIf="especialidades.length > 0">
              <h3>📝 Especialidades Registradas ({{especialidades.length}})</h3>
              <div class="especialidades-grid">
                <div *ngFor="let especialidad of especialidades" class="especialidad-card">
                  <div class="especialidad-info">
                    <h4>{{especialidad.nombre}}</h4>
                    <span class="estado" [class.activa]="especialidad.activa">
                      {{especialidad.activa ? '✅ Activa' : '❌ Inactiva'}}
                    </span>
                  </div>
                  <div class="especialidad-actions">
                    <button (click)="toggleEspecialidadEstado(especialidad)" class="btn-toggle">
                      {{especialidad.activa ? 'Desactivar' : 'Activar'}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pestaña Doctores -->
          <div *ngIf="pestanaActiva === 'doctores'" class="tab-panel">
            <h2>👨‍⚕️ Gestión de Doctores</h2>
            
            <!-- Filtros de Búsqueda -->
            <div class="filtros-section">
              <h3>🔍 Filtros de Búsqueda</h3>
              <div class="filtros-grid">
                <div class="filtro-group">
                  <label for="filtroTexto">Buscar Doctor:</label>
                  <input 
                    type="text" 
                    id="filtroTexto"
                    [(ngModel)]="filtroDoctor" 
                    (input)="filtrarDoctores()"
                    placeholder="Nombre, correo, especialidad, teléfono o licencia..."
                    class="filtro-input">
                </div>
                <div class="filtro-group">
                  <label for="filtroEspecialidad">Especialidad:</label>
                  <select 
                    id="filtroEspecialidad"
                    [(ngModel)]="filtroEspecialidadSeleccionada"
                    (change)="filtrarDoctores()"
                    class="filtro-select">
                    <option value="">Todas las especialidades</option>
                    <option *ngFor="let esp of especialidades" [value]="esp.nombre">
                      {{esp.nombre}}
                    </option>
                  </select>
                </div>
                <div class="filtro-group">
                  <label for="filtroEstado">Estado:</label>
                  <select 
                    id="filtroEstado"
                    [(ngModel)]="filtroEstadoSeleccionado"
                    (change)="filtrarDoctores()"
                    class="filtro-select">
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">✅ Activos</option>
                    <option value="INACTIVO">❌ Inactivos</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Lista de Doctores -->
            <div class="content-section" *ngIf="doctoresFiltrados.length > 0">
              <h3>👨‍⚕️ Doctores Encontrados ({{doctoresFiltrados.length}}/{{doctores.length}})</h3>
              <div class="doctores-grid">
                <div *ngFor="let doctor of doctoresFiltrados" class="doctor-card">
                  <div class="doctor-header">
                    <h4>{{doctor.nombre}}</h4>
                    <span class="estado" [class.activo]="doctor.estado === 'ACTIVO'">
                      {{doctor.estado === 'ACTIVO' ? '✅ Activo' : '❌ Inactivo'}}
                    </span>
                  </div>
                  <div class="doctor-info">
                    <p><strong>📧 Correo:</strong> {{doctor.correo}}</p>
                    <p><strong>🏥 Especialidad:</strong> {{doctor.especialidad}}</p>
                    <p><strong>📞 Teléfono:</strong> {{doctor.telefono}}</p>
                    <p><strong>🆔 Licencia:</strong> {{doctor.numeroLicencia}}</p>
                  </div>
                  <div class="doctor-actions">
                    <button (click)="toggleDoctorEstado(doctor)" class="btn-toggle">
                      {{doctor.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}}
                    </button>
                    <button (click)="eliminarDoctor(doctor)" class="btn-danger">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div *ngIf="doctoresFiltrados.length === 0 && doctores.length > 0" class="no-results">
              🔍 No se encontraron doctores con los filtros aplicados
            </div>
          </div>

          <!-- Pestaña Agregar Doctor -->
          <div *ngIf="pestanaActiva === 'agregar-doctor'" class="tab-panel">
            <h2>➕ Agregar Nuevo Doctor</h2>
            <div class="form-container">
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
                    (blur)="validarCorreo()"
                    [class.error]="correoDuplicado"
                    required>
                  <div class="validation-message" *ngIf="correoDuplicado">
                    ⚠️ Este correo ya está registrado por otro doctor
                  </div>
                  <small class="form-hint" *ngIf="nuevoDoctor.correo && !correoDuplicado">
                    ✅ Correo disponible
                  </small>
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
                    placeholder="Ej: +1 (234) 567-8900"
                    (blur)="formatearTelefono(); validarTelefono()"
                    [class.error]="!telefonoValido">
                  <div class="validation-message" *ngIf="!telefonoValido">
                    ⚠️ Formato de teléfono inválido. Use: +1 (234) 567-8900
                  </div>
                  <small class="form-hint">
                    💡 Puede ingresar solo números, se formateará automáticamente
                  </small>
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
                    placeholder="Ej: LIC-12345 o solo 12345"
                    (blur)="formatearLicencia(); validarLicencia()"
                    [class.error]="licenciaDuplicada"
                    required>
                  <div class="validation-message" *ngIf="licenciaDuplicada">
                    ⚠️ Este número de licencia ya está registrado
                  </div>
                  <small class="form-hint" *ngIf="nuevoDoctor.numeroLicencia && !licenciaDuplicada">
                    ✅ Número de licencia disponible
                  </small>
                  <small class="form-hint">
                    💡 Si ingresa solo números, se agregará automáticamente el prefijo "LIC-"
                  </small>
                </div>
                <button type="submit" class="btn-primary" [disabled]="!esDoctorValido()">
                  👨‍⚕️ Agregar Doctor
                </button>
              </form>
            </div>
          </div>

          <!-- Pestaña Reportes -->
          <div *ngIf="pestanaActiva === 'reportes'" class="tab-panel">
            <h2>📊 Reportes y Consultas del Sistema</h2>
            
            <!-- Controles de Reportes -->
            <div class="reportes-controls">
              <div class="filtros-reporte">
                <h3>🔍 Filtros de Consulta</h3>
                <div class="filtros-grid">
                  <div class="filtro-group">
                    <label>Fecha Desde:</label>
                    <input type="date" [(ngModel)]="fechaDesde" class="filtro-input" (change)="actualizarReporteCitas()">
                  </div>
                  <div class="filtro-group">
                    <label>Fecha Hasta:</label>
                    <input type="date" [(ngModel)]="fechaHasta" class="filtro-input" (change)="actualizarReporteCitas()">
                  </div>
                  <div class="filtro-group">
                    <label>Especialidad:</label>
                    <select [(ngModel)]="especialidadReporte" class="filtro-select" (change)="actualizarReporteCitas()">
                      <option value="">Todas las especialidades</option>
                      <option *ngFor="let esp of especialidades" [value]="esp.nombre">
                        {{esp.nombre}}
                      </option>
                    </select>
                  </div>
                  <div class="filtro-group">
                    <label>Estado de Cita:</label>
                    <select [(ngModel)]="estadoCitaReporte" class="filtro-select" (change)="actualizarReporteCitas()">
                      <option value="">Todos los estados</option>
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="ATENDIDA">Atendida</option>
                      <option value="CANCELADA">Cancelada</option>
                      <option value="NO_ASISTIO">No Asistió</option>
                    </select>
                  </div>
                </div>
                <div class="reportes-buttons">
                  <button class="action-btn" (click)="generarReporteGeneral()">
                    📈 Reporte General
                  </button>
                  <button class="action-btn" (click)="generarReporteDoctores()">
                    👨‍⚕️ Reporte Doctores
                  </button>
                  <button class="action-btn" (click)="generarReporteCitas()">
                    📅 Reporte Citas
                  </button>
                  <button class="action-btn" (click)="consultarEstadisticas()">
                    📊 Estadísticas
                  </button>
                </div>
              </div>
            </div>

            <!-- Resultados de Reportes -->
            <div class="reportes-resultados" *ngIf="reporteActual">
              <h3>{{reporteActual.titulo}}</h3>
              
              <!-- Reporte General -->
              <div *ngIf="reporteActual.tipo === 'general'" class="reporte-general">
                <div class="stats-reporte">
                  <div class="stat-reporte">
                    <h4>👥 Total Usuarios</h4>
                    <span class="numero-stat">{{reporteActual.datos.totalUsuarios}}</span>
                  </div>
                  <div class="stat-reporte">
                    <h4>👨‍⚕️ Total Doctores</h4>
                    <span class="numero-stat">{{reporteActual.datos.totalDoctores}}</span>
                  </div>
                  <div class="stat-reporte">
                    <h4>✅ Doctores Activos</h4>
                    <span class="numero-stat">{{reporteActual.datos.doctoresActivos}}</span>
                  </div>
                  <div class="stat-reporte">
                    <h4>🏥 Especialidades</h4>
                    <span class="numero-stat">{{reporteActual.datos.totalEspecialidades}}</span>
                  </div>
                </div>
                
                <div class="grafico-placeholder">
                  <h4>📊 Distribución por Especialidades</h4>
                  <div class="especialidades-chart">
                    <div *ngFor="let esp of reporteActual.datos.especialidadesStats" class="chart-bar">
                      <div class="bar-label">{{esp.nombre}}</div>
                      <div class="bar-container">
                        <div class="bar-fill" [style.width.%]="(esp.doctores / reporteActual.datos.totalDoctores * 100)">
                          {{esp.doctores}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reporte de Doctores -->
              <div *ngIf="reporteActual.tipo === 'doctores'" class="reporte-doctores">
                <div class="tabla-reporte">
                  <table class="tabla-doctores">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Licencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let doctor of reporteActual.datos" [class.inactivo]="doctor.estado !== 'ACTIVO'">
                        <td>{{doctor.nombre}}</td>
                        <td>{{doctor.especialidad}}</td>
                        <td>{{doctor.correo}}</td>
                        <td>{{doctor.telefono}}</td>
                        <td>
                          <span class="estado" [class.activo]="doctor.estado === 'ACTIVO'">
                            {{doctor.estado === 'ACTIVO' ? '✅ Activo' : '❌ Inactivo'}}
                          </span>
                        </td>
                        <td>{{doctor.numeroLicencia}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Consulta de Estadísticas -->
              <div *ngIf="reporteActual.tipo === 'estadisticas'" class="reporte-estadisticas">
                <div class="stats-grid-reporte">
                  <div class="stat-card-reporte">
                    <h4>📊 Especialidad Más Popular</h4>
                    <p class="stat-valor">{{reporteActual.datos.especialidadMasPopular.nombre}}</p>
                    <small>{{reporteActual.datos.especialidadMasPopular.cantidad}} doctores</small>
                  </div>
                  <div class="stat-card-reporte">
                    <h4>📈 Promedio Doctores por Especialidad</h4>
                    <p class="stat-valor">{{reporteActual.datos.promedioDoctoresPorEspecialidad | number:'1.1-1'}}</p>
                  </div>
                  <div class="stat-card-reporte">
                    <h4>💼 Doctores Registrados Hoy</h4>
                    <p class="stat-valor">{{reporteActual.datos.doctoresHoy}}</p>
                  </div>
                  <div class="stat-card-reporte">
                    <h4>🏥 Cobertura del Sistema</h4>
                    <p class="stat-valor">{{reporteActual.datos.porcentajeCobertura}}%</p>
                    <small>Especialidades cubiertas</small>
                  </div>
                </div>

                <!-- Ranking de Especialidades -->
                <div class="ranking-especialidades">
                  <h4>🏆 Ranking de Especialidades</h4>
                  <div class="ranking-list">
                    <div *ngFor="let esp of reporteActual.datos.rankingEspecialidades; let i = index" class="ranking-item">
                      <span class="ranking-position">{{i + 1}}</span>
                      <span class="ranking-nombre">{{esp.nombre}}</span>
                      <span class="ranking-cantidad">{{esp.doctores}} doctores</span>
                      <div class="ranking-progress">
                        <div class="progress-bar" [style.width.%]="(esp.doctores / reporteActual.datos.totalDoctores * 100)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reporte de Citas -->
              <div *ngIf="reporteActual.tipo === 'citas'" class="reporte-citas">
                <!-- Estadísticas de Citas -->
                <div class="estadisticas-citas">
                  <div class="grid-stats">
                    <div class="stat-card-small">
                      <small class="stat-label">📊 Total</small>
                      <span class="numero-stat-small">{{reporteActual.datos.totalCitas}}</span>
                    </div>
                    <div class="stat-card-small">
                      <small class="stat-label">📅 Hoy</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasHoy}}</span>
                    </div>
                    <div class="stat-card-small">
                      <small class="stat-label">🔄 Pendientes</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasPendientes}}</span>
                    </div>
                    <div class="stat-card-small">
                      <small class="stat-label">✅ Atendidas</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasAtendidas}}</span>
                    </div>
                  </div>
                </div>

                <!-- Lista de Citas (Movida arriba para mejor visibilidad) -->
                <div class="lista-citas">
                  <small class="stat-label">📋 Listado de Citas</small>
                  <div class="tabla-container">
                    <table class="tabla-citas">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Paciente</th>
                          <th>Doctor</th>
                          <th>Especialidad</th>
                          <th>Estado</th>
                          <th>Motivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let cita of reporteActual.datos.listaCitas" [class]="'estado-' + cita.estado.toLowerCase().replace(' ', '-')">
                          <td>{{cita.id}}</td>
                          <td>{{cita.fecha}}</td>
                          <td>{{cita.hora}}</td>
                          <td>{{cita.paciente || 'N/A'}}</td>
                          <td>{{cita.doctor || 'N/A'}}</td>
                          <td>{{cita.especialidad || 'N/A'}}</td>
                          <td>
                            <span class="badge badge-{{cita.estado.toLowerCase().replace(' ', '-')}}">
                              {{cita.estado}}
                            </span>
                          </td>
                          <td class="motivo">{{cita.motivoConsulta || 'N/A'}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Citas por Especialidad -->
                <div class="citas-especialidad">
                  <small class="stat-label">📋 Por Especialidad</small>
                  <div class="especialidad-chart">
                    <div *ngFor="let esp of reporteActual.datos.citasPorEspecialidad" class="chart-bar">
                      <label>{{esp.especialidad}}</label>
                      <div class="bar-container">
                        <div class="bar-fill" [style.width.%]="(esp.cantidad / reporteActual.datos.totalCitas * 100)">
                          <span class="bar-text">{{esp.cantidad}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Citas por Estado -->
                <div class="citas-estado">
                  <small class="stat-label">🎯 Por Estado</small>
                  <div class="estado-grid">
                    <div class="estado-card pendiente" *ngIf="reporteActual.datos.citasPorEstado['Pendiente']">
                      <small class="stat-label">🔄 Pendientes</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasPorEstado['Pendiente']}}</span>
                    </div>
                    <div class="estado-card confirmada" *ngIf="reporteActual.datos.citasPorEstado['Confirmada']">
                      <small class="stat-label">✅ Confirmadas</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasPorEstado['Confirmada']}}</span>
                    </div>
                    <div class="estado-card atendida" *ngIf="reporteActual.datos.citasPorEstado['Atendida']">
                      <small class="stat-label">🩺 Atendidas</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasPorEstado['Atendida']}}</span>
                    </div>
                    <div class="estado-card cancelada" *ngIf="reporteActual.datos.citasPorEstado['Cancelada']">
                      <small class="stat-label">❌ Canceladas</small>
                      <span class="numero-stat-small">{{reporteActual.datos.citasPorEstado['Cancelada']}}</span>
                    </div>
                  </div>
                </div>

                <!-- Información de Filtros -->
                <div class="filtros-aplicados" *ngIf="reporteActual.filtros && (reporteActual.filtros.fechaDesde || reporteActual.filtros.fechaHasta || reporteActual.filtros.especialidad || reporteActual.filtros.estado)">
                  <small class="stat-label">🔍 Filtros Aplicados</small>
                  <div class="filtro-info">
                    <span *ngIf="reporteActual.filtros.fechaDesde" class="filtro-tag">
                      📅 Desde: {{reporteActual.filtros.fechaDesde}}
                    </span>
                    <span *ngIf="reporteActual.filtros.fechaHasta" class="filtro-tag">
                      📅 Hasta: {{reporteActual.filtros.fechaHasta}}
                    </span>
                    <span *ngIf="reporteActual.filtros.especialidad" class="filtro-tag">
                      🏥 Especialidad: {{reporteActual.filtros.especialidad}}
                    </span>
                    <span *ngIf="reporteActual.filtros.estado" class="filtro-tag">
                      🎯 Estado: {{reporteActual.filtros.estado}}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Botones de Exportación -->
              <div class="exportar-section">
                <h4>📤 Exportar Reporte</h4>
                <div class="exportar-buttons">
                  <button class="btn-export" (click)="exportarPDF()">
                    📄 Exportar PDF
                  </button>
                  <button class="btn-export" (click)="exportarExcel()">
                    📊 Exportar Excel
                  </button>
                  <button class="btn-export" (click)="imprimirReporte()">
                    🖨️ Imprimir
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado sin reportes -->
            <div *ngIf="!reporteActual" class="sin-reporte">
              <div class="sin-reporte-content">
                <h3>📊 Sistema de Reportes</h3>
                <p>Seleccione un tipo de reporte para generar consultas detalladas del sistema.</p>
                <ul class="reportes-disponibles">
                  <li><strong>📈 Reporte General:</strong> Vista completa del estado del sistema</li>
                  <li><strong>👨‍⚕️ Reporte Doctores:</strong> Lista detallada de todos los doctores</li>
                  <li><strong>📅 Reporte Citas:</strong> Análisis de citas médicas (próximamente)</li>
                  <li><strong>📊 Estadísticas:</strong> Métricas y análisis avanzados</li>
                </ul>
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

    .form-group input.error,
    .form-group select.error {
      border-color: #e74c3c;
      background-color: #fdf2f2;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }

    .validation-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .form-hint {
      color: #666;
      font-size: 0.8rem;
      margin-top: 3px;
      font-style: italic;
    }

    .form-hint.success {
      color: #27ae60;
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

    .btn-toggle {
      background: #ffc107;
      color: #212529;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
      margin-right: 8px;
    }

    .btn-toggle:hover {
      background: #e0a800;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-delete:hover {
      background: #c82333;
    }

    .lista-container {
      padding: 20px;
    }

    .lista-items {
      display: grid;
      gap: 15px;
    }

    .especialidades-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

    .especialidad-card {
      align-items: center;
      min-height: 60px;
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

    /* Estilos para las pestañas */
    .tabs-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tabs-nav {
      display: flex;
      background: #f8f9fa;
      border-bottom: 2px solid #e1e5e9;
    }

    .tab-button {
      flex: 1;
      background: transparent;
      border: none;
      padding: 15px 10px;
      font-size: 1rem;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
    }

    .tab-button:hover {
      background: #e9ecef;
      color: #495057;
    }

    .tab-button.active {
      background: white;
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      min-height: 500px;
    }

    .tab-panel {
      padding: 30px;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tab-panel h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.8rem;
      border-bottom: 2px solid #e1e5e9;
      padding-bottom: 10px;
    }

    /* Estilos para el Dashboard */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      line-height: 1;
    }

    .stat-label {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 0.9rem;
    }

    .quick-actions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
    }

    .quick-actions h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    /* Estilos para secciones */
    .form-section, .content-section, .filtros-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 25px;
    }

    .form-section h3, .content-section h3, .filtros-section h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .inline-form {
      display: flex;
      gap: 15px;
      align-items: end;
      flex-wrap: wrap;
    }

    .inline-form .form-group {
      flex: 1;
      min-width: 200px;
    }

    /* Estilos para especialidades */
    .especialidades-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }

    .especialidad-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.3s ease;
    }

    .especialidad-card:hover {
      transform: translateY(-2px);
    }

    .especialidad-info h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.1rem;
    }

    /* Estilos para filtros */
    .filtros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .filtro-group {
      display: flex;
      flex-direction: column;
    }

    .filtro-group label {
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }

    .filtro-input, .filtro-select {
      padding: 10px;
      border: 2px solid #e1e5e9;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .filtro-input:focus, .filtro-select:focus {
      outline: none;
      border-color: #667eea;
    }

    /* Estilos para doctores */
    .doctores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .doctor-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .doctor-card:hover {
      transform: translateY(-3px);
    }

    .doctor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e1e5e9;
    }

    .doctor-header h4 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }

    .doctor-info p {
      margin: 8px 0;
      font-size: 0.9rem;
      color: #555;
    }

    .doctor-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e1e5e9;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 1.1rem;
      background: #f8f9fa;
      border-radius: 10px;
    }

    /* Mensaje de estado */
    .mensaje {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

    /* Responsive */
    @media (max-width: 768px) {
      .tabs-nav {
        flex-direction: column;
      }

      .tab-button {
        border-bottom: none;
        border-right: 3px solid transparent;
      }

      .tab-button.active {
        border-right-color: #667eea;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      .inline-form {
        flex-direction: column;
      }

      .filtros-grid {
        grid-template-columns: 1fr;
      }

      .doctores-grid {
        grid-template-columns: 1fr;
      }

      .doctor-actions {
        flex-direction: column;
      }
    }

    /* ===== ESTILOS PARA REPORTES ===== */

    .reportes-controls {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 25px;
    }

    .reportes-buttons {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .reportes-resultados {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .reportes-resultados h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.5rem;
      padding-bottom: 10px;
      border-bottom: 2px solid #e1e5e9;
    }

    /* Reporte General */
    .stats-reporte {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-reporte {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #667eea;
    }

    .stat-reporte h4 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 1rem;
    }

    .numero-stat {
      display: block;
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .grafico-placeholder {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .especialidades-chart {
      margin-top: 15px;
    }

    .chart-bar {
      margin-bottom: 15px;
    }

    .bar-label {
      font-weight: 600;
      margin-bottom: 5px;
      color: #333;
    }

    .bar-container {
      background: #e1e5e9;
      border-radius: 4px;
      height: 30px;
      position: relative;
      overflow: hidden;
    }

    .bar-fill {
      background: linear-gradient(90deg, #667eea, #764ba2);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      color: white;
      font-weight: bold;
      font-size: 0.9rem;
      transition: width 0.8s ease;
    }

    /* Tabla de Reportes */
    .tabla-reporte {
      overflow-x: auto;
      margin-top: 15px;
    }

    .tabla-doctores {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tabla-doctores th {
      background: #667eea;
      color: white;
      padding: 15px 10px;
      text-align: left;
      font-weight: 600;
    }

    .tabla-doctores td {
      padding: 12px 10px;
      border-bottom: 1px solid #e1e5e9;
    }

    .tabla-doctores tr:nth-child(even) {
      background: #f8f9fa;
    }

    .tabla-doctores tr:hover {
      background: #e9ecef;
    }

    .tabla-doctores tr.inactivo {
      opacity: 0.6;
    }

    /* Estadísticas */
    .stats-grid-reporte {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card-reporte {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .stat-card-reporte h4 {
      margin: 0 0 15px 0;
      font-size: 1rem;
      opacity: 0.9;
    }

    .stat-valor {
      display: block;
      font-size: 2.2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-card-reporte small {
      opacity: 0.8;
      font-size: 0.85rem;
    }

    /* Ranking */
    .ranking-especialidades {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
    }

    .ranking-especialidades h4 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ranking-item {
      display: grid;
      grid-template-columns: 40px 1fr auto 150px;
      align-items: center;
      gap: 15px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .ranking-position {
      width: 30px;
      height: 30px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .ranking-nombre {
      font-weight: 600;
      color: #333;
    }

    .ranking-cantidad {
      color: #666;
      font-size: 0.9rem;
    }

    .ranking-progress {
      background: #e1e5e9;
      border-radius: 4px;
      height: 8px;
      overflow: hidden;
    }

    .progress-bar {
      background: linear-gradient(90deg, #667eea, #764ba2);
      height: 100%;
      transition: width 0.8s ease;
    }

    /* Exportación */
    .exportar-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .exportar-section h4 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .exportar-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .btn-export {
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-export:hover {
      background: #218838;
      transform: translateY(-2px);
    }

    /* Sin reporte */
    .sin-reporte {
      text-align: center;
      padding: 50px 20px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .sin-reporte-content h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.8rem;
    }

    .sin-reporte-content p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 25px;
    }

    .reportes-disponibles {
      text-align: left;
      display: inline-block;
      color: #555;
    }

    .reportes-disponibles li {
      margin-bottom: 10px;
      padding: 5px 0;
    }

    .reportes-disponibles strong {
      color: #667eea;
    }

    /* Responsive para reportes */
    @media (max-width: 768px) {
      .reportes-buttons {
        flex-direction: column;
      }
      
      .stats-reporte {
        grid-template-columns: 1fr;
      }
      
      .stats-grid-reporte {
        grid-template-columns: 1fr;
      }
      
      .ranking-item {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 10px;
      }
      
      .tabla-reporte {
        font-size: 0.85rem;
      }
      
      .exportar-buttons {
        flex-direction: column;
      }
    }

    /* Estilos para Reporte de Citas */
    .reporte-citas {
      animation: slideIn 0.5s ease-out;
    }

    .reporte-citas h5 {
      font-size: 1.1rem;
      margin: 0 0 15px 0;
      color: #495057;
      font-weight: 600;
    }

    .estadisticas-citas {
      margin-bottom: 30px;
    }

    .grid-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }

    .stat-card-small {
      background: white;
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      border-left: 4px solid #007bff;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: #6c757d;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .numero-stat-small {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
      line-height: 1.2;
    }

    .citas-especialidad, .citas-estado, .lista-citas {
      margin: 30px 0;
      padding: 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .estado-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .estado-card {
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      border-left: 5px solid;
    }

    .estado-card.pendiente {
      background: #fff3cd;
      border-left-color: #ffc107;
    }

    .estado-card.confirmada {
      background: #d1ecf1;
      border-left-color: #17a2b8;
    }

    .estado-card.atendida {
      background: #d4edda;
      border-left-color: #28a745;
    }

    .estado-card.cancelada {
      background: #f8d7da;
      border-left-color: #dc3545;
    }

    .estado-numero {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      margin-top: 10px;
    }

    .tabla-citas {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .tabla-citas th,
    .tabla-citas td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }

    .tabla-citas th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .tabla-citas tr:hover {
      background: #f8f9fa;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-pendiente {
      background: #ffc107;
      color: #212529;
    }

    .badge-confirmada {
      background: #17a2b8;
      color: white;
    }

    .badge-atendida {
      background: #28a745;
      color: white;
    }

    .badge-cancelada {
      background: #dc3545;
      color: white;
    }

    .motivo {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .filtros-aplicados {
      margin-top: 30px;
      padding: 20px;
      background: #e9ecef;
      border-radius: 10px;
    }

    .filtro-info {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .filtro-tag {
      background: #007bff;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    /* Responsive para reportes de citas */
    @media (max-width: 768px) {
      .estado-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .tabla-citas {
        font-size: 0.9rem;
      }
      
      .filtro-info {
        flex-direction: column;
      }
    }
  `]
})
export class AdminSetupComponent implements OnInit {
  especialidades: Especialidad[] = [];
  doctores: Doctor[] = [];
  doctoresFiltrados: Doctor[] = [];

  // Propiedades para navegación por pestañas
  pestanaActiva: string = 'dashboard';

  // Propiedades para filtros
  filtroDoctor: string = '';
  filtroEspecialidadSeleccionada: string = '';
  filtroEstadoSeleccionado: string = '';

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

  // Propiedades para autocompletado y validación
  correosExistentes: string[] = [];
  licenciasExistentes: string[] = [];
  correoDuplicado: boolean = false;
  licenciaDuplicada: boolean = false;
  telefonoValido: boolean = true;

  // Propiedades para reportes
  fechaDesde: string = '';
  fechaHasta: string = '';
  especialidadReporte: string = '';
  estadoCitaReporte: string = '';
  reporteActual: any = null;

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

  // Método para cambiar pestañas
  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
  }

  // Métodos para el template
  getDoctoresActivos(): number {
    return this.doctores.filter(d => d.estado === 'ACTIVO').length;
  }

  getFechaActual(): string {
    return new Date().toLocaleDateString();
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
        this.doctoresFiltrados = [...doctores]; // Inicializar filtrados
        // Extraer correos y licencias existentes para validación
        this.correosExistentes = doctores.map(doctor => doctor.correo.toLowerCase());
        this.licenciasExistentes = doctores.map(doctor => doctor.numeroLicencia.toLowerCase());
        console.log('✅ Doctores cargados:', doctores.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar doctores:', error);
        this.mostrarMensaje('Error al cargar doctores', true);
      }
    });
  }

  // Métodos de validación en tiempo real
  validarCorreo() {
    const correoLower = this.nuevoDoctor.correo.toLowerCase();
    this.correoDuplicado = this.correosExistentes.includes(correoLower);
  }

  validarLicencia() {
    const licenciaLower = this.nuevoDoctor.numeroLicencia.toLowerCase();
    this.licenciaDuplicada = this.licenciasExistentes.includes(licenciaLower);
  }

  validarTelefono() {
    const telefono = this.nuevoDoctor.telefono;
    // Validar formato de teléfono (puede contener +, números y espacios)
    const telefonoRegex = /^\+?[\d\s\-()]{7,15}$/;
    this.telefonoValido = !telefono || telefonoRegex.test(telefono);
  }

  formatearTelefono() {
    let telefono = this.nuevoDoctor.telefono.replace(/\D/g, ''); // Solo números
    if (telefono.length > 0) {
      if (!telefono.startsWith('1') && telefono.length === 10) {
        telefono = '1' + telefono; // Agregar código de país para US
      }
      // Formatear como +1 (234) 567-8900
      if (telefono.length === 11 && telefono.startsWith('1')) {
        this.nuevoDoctor.telefono = `+${telefono.substring(0, 1)} (${telefono.substring(1, 4)}) ${telefono.substring(4, 7)}-${telefono.substring(7, 11)}`;
      }
    }
  }

  formatearLicencia() {
    // Auto-formatear licencia si no tiene prefijo
    let licencia = this.nuevoDoctor.numeroLicencia.toUpperCase();
    if (licencia && !licencia.startsWith('LIC-') && !licencia.startsWith('MD-')) {
      if (/^\d+$/.test(licencia)) {
        this.nuevoDoctor.numeroLicencia = 'LIC-' + licencia;
      }
    }
  }

  limpiarFormularioDoctor() {
    this.nuevoDoctor = {
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      especialidad: '',
      numeroLicencia: '',
      estado: 'ACTIVO'
    };
    // Limpiar estados de validación
    this.correoDuplicado = false;
    this.licenciaDuplicada = false;
    this.telefonoValido = true;
    // Actualizar listas de correos y licencias existentes
    this.correosExistentes = this.doctores.map(doctor => doctor.correo.toLowerCase());
    this.licenciasExistentes = this.doctores.map(doctor => doctor.numeroLicencia.toLowerCase());
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
        this.doctoresFiltrados = [...this.doctores]; // Actualizar filtrados
        this.limpiarFormularioDoctor();
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
      !this.correoDuplicado &&
      this.nuevoDoctor.password.trim() &&
      this.nuevoDoctor.password.length >= 6 &&
      this.nuevoDoctor.especialidad &&
      this.nuevoDoctor.numeroLicencia.trim() &&
      !this.licenciaDuplicada &&
      this.telefonoValido
    );
  }

  toggleEspecialidadEstado(especialidad: Especialidad) {
    // Aquí implementarías la lógica para cambiar el estado de la especialidad
    this.mostrarMensaje('Funcionalidad de cambio de estado pendiente de implementar', true);
  }

  crearEspecialidad() {
    if (this.filtroEspecialidadSeleccionada) {
      // Verificar si la especialidad ya existe
      const existeEspecialidad = this.especialidades.some(
        esp => esp.nombre.toLowerCase() === this.filtroEspecialidadSeleccionada!.toLowerCase()
      );

      if (existeEspecialidad) {
        this.mostrarMensaje('Esta especialidad ya está registrada en el sistema.', true);
        return;
      }

      const nuevaEspecialidad = {
        nombre: this.filtroEspecialidadSeleccionada,
        descripcion: '', // Descripción vacía por ahora
        activa: true
      };

      this.especialidadService.crearEspecialidad(nuevaEspecialidad).subscribe({
        next: (response) => {
          this.cargarEspecialidades();
          this.filtroEspecialidadSeleccionada = '';
          this.mostrarMensaje('✅ Especialidad creada exitosamente', false);
        },
        error: (error) => {
          console.error('Error al crear especialidad:', error);
          this.mostrarMensaje('Error al crear la especialidad: ' + (error.error?.message || error.message), true);
        }
      });
    }
  }

  toggleDoctorEstado(doctor: Doctor) {
    this.http.put<Doctor>(`http://localhost:8081/api/doctores/${doctor.id}/toggle-estado`, {}).subscribe({
      next: (doctorActualizado) => {
        // Actualizar el doctor en la lista local
        const index = this.doctores.findIndex(d => d.id === doctor.id);
        if (index !== -1) {
          this.doctores[index] = doctorActualizado;
        }

        const accion = doctorActualizado.estado === 'ACTIVO' ? 'activado' : 'desactivado';
        this.mostrarMensaje(`Doctor ${doctor.nombre} ${accion} exitosamente`, false);
      },
      error: (error) => {
        console.error('❌ Error al cambiar estado del doctor:', error);
        this.mostrarMensaje('Error al cambiar el estado del doctor: ' + (error.error?.message || error.message), true);
      }
    });
  }

  eliminarDoctor(doctor: Doctor) {
    if (confirm(`¿Estás seguro de que deseas eliminar al doctor ${doctor.nombre}? Esta acción no se puede deshacer.`)) {
      this.http.delete(`http://localhost:8081/api/doctores/${doctor.id}`).subscribe({
        next: () => {
          // Remover el doctor de la lista local
          this.doctores = this.doctores.filter(d => d.id !== doctor.id);
          this.mostrarMensaje(`Doctor ${doctor.nombre} eliminado exitosamente`, false);
        },
        error: (error) => {
          console.error('❌ Error al eliminar doctor:', error);
          this.mostrarMensaje('Error al eliminar el doctor: ' + (error.error?.message || error.message), true);
        }
      });
    }
  }

  filtrarDoctores() {
    let resultado = [...this.doctores];

    // Filtrar por texto de búsqueda
    if (this.filtroDoctor.trim()) {
      const textoBusqueda = this.filtroDoctor.toLowerCase();
      resultado = resultado.filter(doctor =>
        doctor.nombre.toLowerCase().includes(textoBusqueda) ||
        doctor.especialidad.toLowerCase().includes(textoBusqueda) ||
        doctor.correo.toLowerCase().includes(textoBusqueda) ||
        doctor.telefono.toLowerCase().includes(textoBusqueda) ||
        doctor.numeroLicencia.toLowerCase().includes(textoBusqueda)
      );
    }

    // Filtrar por especialidad
    if (this.filtroEspecialidadSeleccionada) {
      resultado = resultado.filter(doctor =>
        doctor.especialidad === this.filtroEspecialidadSeleccionada
      );
    }

    // Filtrar por estado
    if (this.filtroEstadoSeleccionado) {
      resultado = resultado.filter(doctor =>
        doctor.estado === this.filtroEstadoSeleccionado
      );
    }

    this.doctoresFiltrados = resultado;
  }

  mostrarMensaje(texto: string, esError: boolean) {
    this.mensaje = texto;
    this.esError = esError;
    setTimeout(() => {
      this.mensaje = '';
    }, 5000);
  }

  // ===== MÉTODOS DE REPORTES =====
  generarReporteGeneral() {
    console.log('🔄 Generando reporte general...');

    this.http.get<any>('http://localhost:8081/api/reportes/general').subscribe({
      next: (response) => {
        if (response.success) {
          this.reporteActual = response;
          this.mostrarMensaje('✅ Reporte general generado exitosamente', false);
        } else {
          this.mostrarMensaje('❌ Error al generar reporte: ' + response.message, true);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener reporte general:', error);
        this.mostrarMensaje('❌ Error de conexión al generar reporte general', true);
      }
    });
  }

  generarReporteDoctores() {
    console.log('🔄 Generando reporte de doctores...');

    let params = new URLSearchParams();
    if (this.especialidadReporte) {
      params.append('especialidad', this.especialidadReporte);
    }

    const url = `http://localhost:8081/api/reportes/doctores${params.toString() ? '?' + params.toString() : ''}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.success) {
          this.reporteActual = response;
          this.mostrarMensaje(`✅ Reporte de doctores generado: ${response.totalRegistros} registros`, false);
        } else {
          this.mostrarMensaje('❌ Error al generar reporte: ' + response.message, true);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener reporte de doctores:', error);
        this.mostrarMensaje('❌ Error de conexión al generar reporte de doctores', true);
      }
    });
  }
  generarReporteCitas() {
    console.log('🔄 Generando reporte de citas...');
    console.log('📅 Filtros aplicados:', {
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      especialidad: this.especialidadReporte,
      estado: this.estadoCitaReporte
    });

    let params = new URLSearchParams();
    if (this.fechaDesde && this.fechaDesde.trim() !== '') {
      params.append('fechaDesde', this.fechaDesde);
      console.log('✅ Agregando filtro fechaDesde:', this.fechaDesde);
    }
    if (this.fechaHasta && this.fechaHasta.trim() !== '') {
      params.append('fechaHasta', this.fechaHasta);
      console.log('✅ Agregando filtro fechaHasta:', this.fechaHasta);
    }
    if (this.especialidadReporte && this.especialidadReporte.trim() !== '') {
      params.append('especialidad', this.especialidadReporte);
      console.log('✅ Agregando filtro especialidad:', this.especialidadReporte);
    }
    if (this.estadoCitaReporte && this.estadoCitaReporte.trim() !== '') {
      params.append('estado', this.estadoCitaReporte);
      console.log('✅ Agregando filtro estado:', this.estadoCitaReporte);
    }

    const url = `http://localhost:8081/api/reportes/citas${params.toString() ? '?' + params.toString() : ''}`;

    console.log('🔗 URL generada:', url);

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.success) {
          this.reporteActual = response;
          this.mostrarMensaje('✅ Reporte de citas generado exitosamente', false);
        } else {
          this.mostrarMensaje('❌ Error al generar reporte: ' + response.message, true);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener reporte de citas:', error);
        this.mostrarMensaje('❌ Error de conexión al generar reporte de citas', true);
      }
    });
  }

  consultarEstadisticas() {
    console.log('🔄 Consultando estadísticas avanzadas...');

    this.http.get<any>('http://localhost:8081/api/reportes/estadisticas').subscribe({
      next: (response) => {
        if (response.success) {
          this.reporteActual = response;
          this.mostrarMensaje('✅ Estadísticas generadas exitosamente', false);
        } else {
          this.mostrarMensaje('❌ Error al generar estadísticas: ' + response.message, true);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener estadísticas:', error);
        this.mostrarMensaje('❌ Error de conexión al generar estadísticas', true);
      }
    });
  }

  // Método para actualizar el reporte automáticamente cuando cambien los filtros
  actualizarReporteCitas() {
    // Solo actualizar si ya hay un reporte de citas activo
    if (this.reporteActual && this.reporteActual.tipo === 'citas') {
      console.log('🔄 Actualizando reporte de citas automáticamente...');
      this.generarReporteCitas();
    }
  }

  // ===== MÉTODOS AUXILIARES PARA REPORTES =====

  private calcularEspecialidadesStats() {
    const stats = this.especialidades.map(esp => {
      const doctores = this.doctores.filter(d => d.especialidad === esp.nombre).length;
      return {
        nombre: esp.nombre,
        doctores: doctores
      };
    });

    return stats.sort((a, b) => b.doctores - a.doctores);
  }

  private calcularRankingEspecialidades() {
    const ranking = this.especialidades.map(esp => {
      const doctores = this.doctores.filter(d => d.especialidad === esp.nombre).length;
      return {
        nombre: esp.nombre,
        doctores: doctores
      };
    });

    return ranking.sort((a, b) => b.doctores - a.doctores).slice(0, 5);
  }

  private simularDoctoresHoy(): number {
    // Simular que algunos doctores se registraron hoy
    return Math.floor(Math.random() * 3) + 1;
  }

  private calcularPorcentajeCobertura(): number {
    // Calcular qué porcentaje de especialidades tienen al menos un doctor
    const especialidadesConDoctores = this.especialidades.filter(esp =>
      this.doctores.some(d => d.especialidad === esp.nombre)
    ).length;

    return Math.round((especialidadesConDoctores / Math.max(this.especialidades.length, 1)) * 100);
  }

  // ===== MÉTODOS DE EXPORTACIÓN =====

  exportarPDF() {
    this.mostrarMensaje('📄 Función de exportar PDF en desarrollo', true);
    console.log('Exportando reporte a PDF:', this.reporteActual);
  }

  exportarExcel() {
    this.mostrarMensaje('📊 Función de exportar Excel en desarrollo', true);
    console.log('Exportando reporte a Excel:', this.reporteActual);
  }

  imprimirReporte() {
    this.mostrarMensaje('🖨️ Función de imprimir en desarrollo', true);
    console.log('Imprimiendo reporte:', this.reporteActual);
    // En una implementación real, aquí se abriría la ventana de impresión
    // window.print();
  }
}
