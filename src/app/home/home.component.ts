import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          
          <!-- Bienvenida personalizada por rol -->
          <div class="card shadow">
            <div class="card-body text-center py-5">
              <div *ngIf="auth.esDoctor()">
                <i class="fas fa-user-md fa-4x text-primary mb-4"></i>
                <h2 class="mb-3">Bienvenido, Dr. {{ auth.obtenerUsuario()?.nombre }}</h2>
                <p class="lead text-muted mb-4">Gestione sus horarios y citas médicas</p>
                <div class="d-grid gap-2 d-md-block">
                  <a routerLink="/doctor/dashboard" class="btn btn-primary btn-lg me-2">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    Ver Dashboard
                  </a>
                  <a routerLink="/doctor/gestionar-horarios" class="btn btn-outline-primary btn-lg">
                    <i class="fas fa-calendar-alt me-2"></i>
                    Gestionar Horarios
                  </a>
                </div>
              </div>

              <div *ngIf="auth.esPaciente()">
                <i class="fas fa-user fa-4x text-success mb-4"></i>
                <h2 class="mb-3">Bienvenido, {{ auth.obtenerUsuario()?.nombre }}</h2>
                <p class="lead text-muted mb-4">Agende y gestione sus citas médicas</p>
                <div class="d-grid gap-2 d-md-block">
                  <a routerLink="/agendar" class="btn btn-success btn-lg me-2">
                    <i class="fas fa-calendar-plus me-2"></i>
                    Agendar Cita
                  </a>
                  <a routerLink="/mis-citas" class="btn btn-outline-success btn-lg">
                    <i class="fas fa-calendar-check me-2"></i>
                    Mis Citas
                  </a>
                </div>
              </div>

              <div *ngIf="auth.esAsistente()">
                <i class="fas fa-user-nurse fa-4x text-info mb-4"></i>
                <h2 class="mb-3">Bienvenido, {{ auth.obtenerUsuario()?.nombre }}</h2>
                <p class="lead text-muted mb-4">Ayude a los pacientes a gestionar sus citas</p>
                <div class="d-grid gap-2 d-md-block">
                  <a routerLink="/agendar" class="btn btn-info btn-lg me-2">
                    <i class="fas fa-calendar-plus me-2"></i>
                    Agendar Citas
                  </a>
                  <a routerLink="/mis-citas" class="btn btn-outline-info btn-lg">
                    <i class="fas fa-calendar-check me-2"></i>
                    Gestionar Citas
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del sistema -->
          <div class="row mt-5">
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-shield-alt fa-3x text-success mb-3"></i>
                  <h5>Seguro y Confiable</h5>
                  <p class="text-muted">Sus datos están protegidos con los más altos estándares de seguridad.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-clock fa-3x text-primary mb-3"></i>
                  <h5>Disponible 24/7</h5>
                  <p class="text-muted">Agende sus citas en cualquier momento del día.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-mobile-alt fa-3x text-info mb-3"></i>
                  <h5>Fácil de Usar</h5>
                  <p class="text-muted">Interfaz intuitiva desde cualquier dispositivo.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón para cambiar entre roles (demo) -->
          <div class="row mt-5">
            <div class="col-md-12 text-center">
              <div *ngIf="auth.esPaciente()" class="mt-4 pt-4 border-top">
                <h6 class="text-muted mb-3">Demo del Sistema</h6>
                <button class="btn btn-info btn-sm" (click)="cambiarADoctor()">
                  <i class="fas fa-user-md me-2"></i>
                  Ver Demo como Doctor
                </button>
                <small class="d-block text-muted mt-2">
                  Cambia temporalmente a la vista de doctor para ver todas las funcionalidades
                </small>
              </div>

              <div *ngIf="auth.esDoctor()" class="mt-4 pt-4 border-top">
                <h6 class="text-muted mb-3">Demo del Sistema</h6>
                <button class="btn btn-success btn-sm" (click)="cambiarAPaciente()">
                  <i class="fas fa-user me-2"></i>
                  Ver Demo como Paciente
                </button>
                <small class="d-block text-muted mt-2">
                  Cambia temporalmente a la vista de paciente para ver otras funcionalidades
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    
    .card-body {
      padding: 2rem;
    }
    
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .d-md-block {
        display: block !important;
      }
      
      .btn-lg {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  estadisticas: any = {};

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    
    // Auto-login demo si no hay usuario autenticado
    if (!this.auth.estaAutenticado()) {
      this.auth.loginDemo().then(() => {
        console.log('🎯 Auto-login demo completado');
        this.cargarEstadisticas();
      });
    }
  }

  cargarEstadisticas(): void {
    // Estadísticas demo para mostrar funcionalidad
    this.estadisticas = {
      totalCitas: 24,
      citasHoy: 3,
      citasPendientes: 5,
      doctoresDisponibles: 8
    };
  }

  cambiarADoctor(): void {
    this.auth.cambiarARol('doctor');
    this.cargarEstadisticas();
  }

  cambiarAPaciente(): void {
    this.auth.cambiarARol('paciente');
    this.cargarEstadisticas();
  }
}
