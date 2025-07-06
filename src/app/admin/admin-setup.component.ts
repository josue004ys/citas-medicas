import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-setup',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title mb-0">
                <i class="fas fa-user-shield me-2"></i>
                Panel de Administración
              </h3>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                <h5><i class="fas fa-info-circle me-2"></i>Sistema Limpio</h5>
                <p class="mb-0">
                  El sistema está configurado correctamente y funcionando. 
                  Puedes proceder a registrar usuarios y especialidades manualmente.
                </p>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="card border-primary">
                    <div class="card-body text-center">
                      <i class="fas fa-users fa-3x text-primary mb-3"></i>
                      <h5>Gestión de Usuarios</h5>
                      <p class="text-muted">Registra doctores y pacientes</p>
                      <a href="/registro" class="btn btn-primary">
                        Ir a Registro
                      </a>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="card border-success">
                    <div class="card-body text-center">
                      <i class="fas fa-stethoscope fa-3x text-success mb-3"></i>
                      <h5>Especialidades</h5>
                      <p class="text-muted">Gestiona especialidades médicas</p>
                      <button class="btn btn-success" disabled>
                        Próximamente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4">
                <h6>Estado del Sistema:</h6>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <i class="fas fa-database me-2 text-success"></i>
                      Base de Datos
                    </span>
                    <span class="badge bg-success rounded-pill">Conectada</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <i class="fas fa-server me-2 text-success"></i>
                      Backend API
                    </span>
                    <span class="badge bg-success rounded-pill">Activo</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <i class="fas fa-shield-alt me-2 text-success"></i>
                      Autenticación JWT
                    </span>
                    <span class="badge bg-success rounded-pill">Configurada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    .fa-3x {
      font-size: 3rem;
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
    }
    
    .list-group-item:first-child {
      border-top: none;
    }
    
    .list-group-item:last-child {
      border-bottom: none;
    }
  `]
})
export class AdminSetupComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        console.log('AdminSetupComponent inicializado - Sistema limpio y funcionando');
    }
}
