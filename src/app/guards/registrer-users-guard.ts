import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const registerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getSessionToken();

  // 1. Si NO está logueado, lo dejamos pasar sin problema (usuario nuevo / público)
  if (!token || token.trim() === '') {
    return true;
  }

  // 2. Si SÍ está logueado, obtenemos su rol para evaluar
  const userGroup = authService.getUserGroup(); // 'administrador', 'maestro' o 'alumno'

  // Si es administrador o maestro, los dejamos entrar a registrar a alguien más
  if (userGroup === 'administrador' || userGroup === 'maestro') {
    return true;
  }

  // 3. Si llega hasta aquí, significa que está logueado pero es 'alumno' (o un rol no reconocido).
  // Lo rebotamos al home.
  console.warn('Acceso denegado: Los alumnos no pueden acceder al registro.');
  router.navigate(['/home']);
  return false;
};
