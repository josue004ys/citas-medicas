import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AgendarCitaComponent } from './citas/agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './citas/mis-citas/mis-citas.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mis-citas', component: MisCitasComponent, canActivate: [AuthGuard] },
  { path: 'agendar', component: AgendarCitaComponent, canActivate: [AuthGuard] },
  { path: 'mis-citas', component: MisCitasComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
