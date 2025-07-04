import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2>Dashboard del Doctor</h2>
          <p>Panel de control para doctores - En desarrollo</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class DashboardDoctorComponent {
  constructor() { }
}
