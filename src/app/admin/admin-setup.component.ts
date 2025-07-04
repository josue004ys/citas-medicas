import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-setup',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">🔧 Configuración Inicial del Sistema</h3>
            </div>
            <div class="card-body">
              
              <!-- Estado del Sistema -->
              <div class="alert alert-info">
                <h5>📊 Estado Actual del Sistema:</h5>
                <ul class="mb-0">
                  <li>Especialidades: {{ estadoSistema.especialidades || 0 }}</li>
                  <li>Pacientes registrados: {{ estadoSistema.pacientes || 0 }}</li>
                  <li>Administrador: {{ estadoSistema.adminExiste ? '✅ Existe' : '❌ No existe' }}</li>
                </ul>
              </div>

              <!-- Botón para inicializar -->
              <div class="text-center mb-4">
                <button 
                  class="btn btn-success btn-lg" 
                  [disabled]="cargando || estadoSistema.sistemaInicializado"
                  (click)="inicializarSistema()">
                  
                  <span *ngIf="cargando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ estadoSistema.sistemaInicializado ? '✅ Sistema ya inicializado' : '🚀 Inicializar Sistema' }}
                </button>
              </div>

              <!-- Resultado -->
              <div *ngIf="resultado" [class]="'alert ' + (resultado.success ? 'alert-success' : 'alert-danger')">
                <h5>{{ resultado.success ? '✅ Éxito' : '❌ Error' }}</h5>
                <p>{{ resultado.message }}</p>
                
                <div *ngIf="resultado.success && resultado.credencialesAdmin">
                  <hr>
                  <h6>🔑 Credenciales de Administrador:</h6>
                  <ul>
                    <li><strong>Email:</strong> {{ resultado.credencialesAdmin.email }}</li>
                    <li><strong>Password:</strong> {{ resultado.credencialesAdmin.password }}</li>
                  </ul>
                  <small class="text-muted">⚠️ Guarda estas credenciales en un lugar seguro</small>
                </div>
              </div>

              <!-- Instrucciones -->
              <div class="card mt-4">
                <div class="card-header">
                  <h5>📋 Próximos pasos después de la inicialización:</h5>
                </div>
                <div class="card-body">
                  <ol>
                    <li>✅ Inicia sesión con las credenciales de administrador</li>
                    <li>🏥 Revisa las especialidades creadas</li>
                    <li>👨‍⚕️ Registra doctores para cada especialidad</li>
                    <li>⏰ Configura horarios de atención</li>
                    <li>📅 El sistema estará listo para agendar citas</li>
                  </ol>
                </div>
              </div>

              <div class="text-center mt-4">
                <button class="btn btn-outline-primary" (click)="verificarEstado()">
                  🔄 Actualizar Estado
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class AdminSetupComponent {
    private readonly API_URL = 'http://localhost:8081/api/admin';

    estadoSistema: any = {};
    resultado: any = null;
    cargando = false;

    constructor(private http: HttpClient) {
        this.verificarEstado();
    }

    verificarEstado() {
        this.http.get(`${this.API_URL}/verificar-estado`).subscribe({
            next: (response: any) => {
                this.estadoSistema = response;
                console.log('Estado del sistema:', response);
            },
            error: (error) => {
                console.error('Error al verificar estado:', error);
                this.resultado = {
                    success: false,
                    message: 'Error al conectar con el servidor. Verifica que el backend esté corriendo.'
                };
            }
        });
    }

    inicializarSistema() {
        this.cargando = true;
        this.resultado = null;

        this.http.post(`${this.API_URL}/inicializar-sistema`, {}).subscribe({
            next: (response: any) => {
                this.resultado = response;
                this.cargando = false;

                // Actualizar estado después de la inicialización
                setTimeout(() => {
                    this.verificarEstado();
                }, 1000);
            },
            error: (error) => {
                console.error('Error al inicializar sistema:', error);
                this.resultado = {
                    success: false,
                    message: 'Error al inicializar el sistema: ' + (error.error?.message || error.message)
                };
                this.cargando = false;
            }
        });
    }
}
