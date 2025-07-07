import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'citas-medicas';

  constructor(public auth: AuthService) { }

  obtenerRutaInicio(): string {
    if (this.auth.esDoctor()) {
      return '/doctor/dashboard';
    }
    return '/home';
  }
}
