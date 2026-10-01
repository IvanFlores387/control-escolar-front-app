import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificación de Autenticación (¿Está logueado?)
  if (!authService.getSessionToken()) {
    // Si no hay token, lo pateamos al login
    console.log('No estas autenticado')
    router.navigate(['/login']);
    return false;
  }

  // 2. Verificación de Roles (¿Tiene permiso para esta pantalla en específico?)
  const expectedRoles: string[] = route.data['expectedRoles'];

  // Si la ruta no especifica roles, significa que cualquier usuario logueado puede entrar
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const userGroup = authService.getUserGroup(); // 'administrador', 'maestro', o 'alumno'

  // Si el rol del usuario está en la lista de roles permitidos de la ruta
  if (expectedRoles.includes(userGroup)) {
    console.log(userGroup);
    return true;
  } else {
    // Si está logueado pero NO tiene el rol, lo mandamos al inicio
    console.log('No perteneces a este rol')
    router.navigate(['/app/home']);
    return false;
  }
};
