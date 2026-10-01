import { Component, inject, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AuthService } from '../../services/auth-service';
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';
import { EliminarUserModal } from '../../modals/eliminar-user-modal/eliminar-user-modal';

@Component({
  selector: 'app-alumnos-screen',
  imports: [...SHARED_IMPORTS],
  templateUrl: './alumnos-screen.html',
  styleUrl: './alumnos-screen.scss',
  standalone: true,
})
export class AlumnosScreen {

  public name_user: string = '';
  public rol: string = '';
  public lista_alumnos: any[] = [];

  displayedColumns: string[] = [
    'matricula',
    'nombre',
    'email',
    'fecha_nacimiento',
    'edad',
    'curp',
    'rfc',
    'telefono',
    'ocupacion',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosAlumno>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private authService = inject(AuthService);
  private alumnosService = inject(AlumnosService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserGroup();
    this.obtenerAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public obtenerAlumnos(): void {
    this.alumnosService.obtenerListaAlumnos().subscribe({
      next: (response) => {
        this.lista_alumnos = response;

        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach((usuario) => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
        }

        this.dataSource = new MatTableDataSource<DatosAlumno>(
          this.lista_alumnos as DatosAlumno[]
        );

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: () => {
        this.notificationService.error('No se pudo obtener la lista de usuarios');
      }
    });
  }

  public goEditar(idUser: number, isUserId?: boolean): void {
    const userId = Number(this.authService.getUserId());

    if (
      this.rol === 'administrador' ||
      this.rol === 'maestro' ||
      (this.rol === 'alumno' && userId === idUser)
    ) {
      this.router.navigate(['/app/registro-usuarios', 'alumno', idUser]);
    } else {
      this.notificationService.error('No tienes permisos para editar este alumno');
    }
  }

  public delete(idUser: number, isUserId?: boolean): void {
    const userId = Number(this.authService.getUserId());

    if (
      this.rol === 'administrador' ||
      this.rol === 'maestro' ||
      (this.rol === 'alumno' && userId === idUser)
    ) {
      const dialogRef = this.dialog.open(EliminarUserModal, {
        data: { id: idUser, rol: 'alumno' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.isDelete) {
          this.obtenerAlumnos();
        } else {
          this.notificationService.error('Alumno no se ha podido eliminar.');
        }
      });
    } else {
      this.notificationService.error('No tienes permisos para eliminar este alumno');
    }
  }
}

