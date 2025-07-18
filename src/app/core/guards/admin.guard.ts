import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        // Verificar que el usuario esté autenticado
        if (!this.auth.estaAutenticado()) {
            console.log('🚫 Usuario no autenticado, redirigiendo a login');
            this.router.navigate(['/login']);
            return false;
        }

        // Verificar que el usuario sea administrador
        if (!this.auth.esAdmin()) {
            console.log('🚫 Usuario no es administrador, redirigiendo a home');
            this.router.navigate(['/home']);
            return false;
        }

        console.log('✅ Usuario administrador autenticado, permitiendo acceso');
        return true;
    }
}
