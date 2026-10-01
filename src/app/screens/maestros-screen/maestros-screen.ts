import { Component, inject, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';
import { EliminarUserModal } from '../../modals/eliminar-user-modal/eliminar-user-modal';

@Component({
  selector: 'app-maestros-screen',
  imports: [...SHARED_IMPORTS],
  templateUrl: './maestros-screen.html',
  styleUrl: './maestros-screen.scss',
})
export class MaestrosScreen {
  public name_user: string = '';
  public rol: string = '';
  public lista_maestros: any[] = [];

  displayedColumns: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'cubiculo',
    'area_investigacion',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosMaestro>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private authService = inject(AuthService);
  private maestrosService = inject(MaestrosService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserGroup();
    this.obtenerMaestros();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public obtenerMaestros(): void {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response) => {
        this.lista_maestros = response;

        if (this.lista_maestros.length > 0) {
          this.lista_maestros.forEach((usuario) => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
        }

        this.dataSource = new MatTableDataSource<DatosMaestro>(
          this.lista_maestros as DatosMaestro[]
        );

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: () => {
        this.notificationService.error('No se pudo obtener la lista de maestros');
      }
    });
  }

  public goEditar(idUser: number): void {
    const userId = Number(this.authService.getUserId());

    if (
      this.rol === 'administrador' ||
      this.rol === 'alumno' ||
      (this.rol === 'maestro' && userId === idUser)
    )
    {
      this.router.navigate(['/app/registro-usuarios', 'maestro', idUser]);
    }
    else{
       this.notificationService.error('No tienes permisos para editar este maestro');
    }


  }

  public delete(idUser: number): void {
    const userIdSession = Number(this.authService.getUserId());

    if (this.rol === 'administrador' || (this.rol === 'maestro' && userIdSession === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModal, {
        data: { id: idUser, rol: 'maestro' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.isDelete) {
          this.obtenerMaestros();
        } else {
          this.notificationService.error('Maestro no se ha podido eliminar.');
        }
      });
    } else {
      this.notificationService.error('No tienes permisos para eliminar este maestro.');
    }
  }
}

