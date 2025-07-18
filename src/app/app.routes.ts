import { Routes } from '@angular/router';
import { AdminSetupComponent } from './admin/admin-setup.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { AgendarCitaComponent } from './citas/agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './citas/mis-citas/mis-citas.component';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardDoctorComponent } from './doctor/dashboard-doctor/dashboard-doctor.component';
import { GestionarCitasDoctorComponent } from './doctor/gestionar-citas-doctor/gestionar-citas-doctor.component';
import { GestionarHorariosComponent } from './doctor/gestionar-horarios/gestionar-horarios.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // Ruta para configuración inicial (solo para administradores)
  { path: 'admin-setup', component: AdminSetupComponent, canActivate: [AdminGuard] },

  // Rutas para pacientes y asistentes
  { path: 'agendar', component: AgendarCitaComponent, canActivate: [AuthGuard] },
  { path: 'mis-citas', component: MisCitasComponent, canActivate: [AuthGuard] },

  // Rutas para doctores
  { path: 'doctor/dashboard', component: DashboardDoctorComponent, canActivate: [AuthGuard] },
  { path: 'doctor/gestionar-horarios', component: GestionarHorariosComponent, canActivate: [AuthGuard] },
  { path: 'doctor/gestionar-citas', component: GestionarCitasDoctorComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/login' }
];
