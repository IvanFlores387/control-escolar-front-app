import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getSessionToken();

  // Validamos que el token exista y no sea un string vacío
  if (token && token.trim() !== '') {
    console.log('Public Guard: Token detectado, redirigiendo al home...'); // Esto te ayudará a depurar
    router.navigate(['/app/home']);
    return false;
  }

  return true;
};
