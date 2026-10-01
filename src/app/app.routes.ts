import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { HomeScreen } from './screens/home-screen/home-screen';
import { AdminScreen } from './screens/admin-screen/admin-screen';
import { AlumnosScreen } from './screens/alumnos-screen/alumnos-screen';
import { MaestrosScreen } from './screens/maestros-screen/maestros-screen';
import { GraficasScreen } from './screens/graficas-screen/graficas-screen';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import LoginScreen from './screens/login-screen/login-screen';
import RegistroUsuariosScreen from './screens/registro-usuarios-screen/registro-usuarios-screen';
import { publicGuard } from './guards/public-guard';
import { authUserGuard } from './guards/auth-users-guard';
import { registerGuard } from './guards/registrer-users-guard';
import { LandingPage } from './pages/landing-page/landing-page';
import { MateriasScreen } from './screens/materias-screen/materias-screen';
import { EventosAcademicosScreen } from './screens/eventos-academicos-screen/eventos-academicos-screen';

export const routes: Routes = [
  /* { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./screens/login-screen/login-screen')
  },
  {
    path: 'registro-usuarios',
    loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen')
  }, */

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full'  },
      { path: 'inicio', component: LandingPage},
      { path: 'login', component: LoginScreen, canActivate: [publicGuard]},
      { path: 'registro-usuarios', component: RegistroUsuariosScreen, canActivate: [registerGuard]},
    ]
  },

  {
    path: 'app',
    component: DashboardLayout,
    canActivate: [authUserGuard],
    children: [
      { path: 'home', component: HomeScreen, canActivate: [authUserGuard] },
      { path: 'administrador', component: AdminScreen, canActivate: [authUserGuard],data: { expectedRoles: ['administrador'] } },
      { path: 'alumnos', component: AlumnosScreen, canActivate: [authUserGuard],data: { expectedRoles: ['administrador', 'maestro', 'alumno'] }},
      { path: 'maestros', component: MaestrosScreen, canActivate: [authUserGuard],data: { expectedRoles: ['administrador', 'maestro'] }},
      { path: 'graficas', component: GraficasScreen, canActivate: [authUserGuard],data: { expectedRoles: ['administrador','maestro', 'alumno'] }},
      { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreen, canActivate: [authUserGuard],data: { expectedRoles: ['administrador', 'alumno', 'maestro'] }},
      {
  path: 'materias',
  component: MateriasScreen,
  canActivate: [authUserGuard],
  data: {
    expectedRoles: [
      'administrador',
      'maestro'
    ]
  }
},
      {
  path: 'eventos-academicos',
  component: EventosAcademicosScreen,
  canActivate: [authUserGuard],
  data: {
    expectedRoles: [
      'administrador',
      'maestro'
    ]
  }
}
    ]
  },
  { path: '**', redirectTo: '/inicio' }
];
