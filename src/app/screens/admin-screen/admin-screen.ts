import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AdministradoresService } from '../../services/administradores-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-screen',
  imports: [...SHARED_IMPORTS],
  templateUrl: './admin-screen.html',
  styleUrl: './admin-screen.scss',
  standalone: true
})
export class AdminScreen {
  public name_user: string = '';
  public lista_admins: any[] = [];

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private administradoresService = inject(AdministradoresService);
  private router = inject(Router);

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.obtenerAdmins();
  }

  public obtenerAdmins(): void {
    this.administradoresService.obtenerListaAdmins().subscribe({
      next: (response) => {
        this.lista_admins = response;
      },
      error: () => {
        this.notificationService.error('No se pudo obtener la lista de administradores');
      }
    });
  }

  public goEditar(idUser: number): void {
    this.router.navigate(['/app/registro-usuarios', 'administrador', idUser]);
  }

  public delete(idUser: number): void {
  this.administradoresService.eliminarAdmin(idUser).subscribe({
    next: () => {
      this.notificationService.success('Administrador eliminado correctamente');
      this.obtenerAdmins();
    },
    error: () => {
      this.notificationService.error('No se pudo eliminar el administrador');
    }
  });
}
}
