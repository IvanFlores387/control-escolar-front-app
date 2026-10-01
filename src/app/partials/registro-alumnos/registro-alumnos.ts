import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { NotificationService } from '../../services/tools/notification-service';
import { AlumnosService } from '../../services/alumnos-service';
import { MatDialog } from '@angular/material/dialog';
import { EditarUserModal } from '../../modals/editar-user-modal/editar-user-modal';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos {

  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;
  public fechaVisual: Date | null = null;

  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private alumnosService = inject(AlumnosService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    if (id !== undefined) {
      this.editar = true;
      this.idUser = Number(id);
      this.alumno = JSON.parse(JSON.stringify(this.datos_user));

      if (this.alumno.fecha_nacimiento) {
        const partesFecha = this.alumno.fecha_nacimiento.split('-');
        if (partesFecha.length === 3) {
          const anio = parseInt(partesFecha[0], 10);
          const mes = parseInt(partesFecha[1], 10) - 1;
          const dia = parseInt(partesFecha[2], 10);

          this.fechaVisual = new Date(anio, mes, dia); // <-- Asignamos a fechaVisual
        }
      }
    } else {
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
    }
  }

  public regresar(): void {
    this.location.back();
  }

  public registrar(): void {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.alumno.password === this.alumno.confirmar_password) {
      this.alumnosService.registrarAlumno(this.alumno).subscribe({
        next: () => {
          this.notificationService.success('Alumno registrado exitosamente');
          this.router.navigate(['/alumnos']);
        },
        error: () => {
          this.notificationService.error('Error al registrar alumno');
        }
      });
    } else {
      this.notificationService.error('Las contraseñas no coinciden');
      this.alumno.password = '';
      this.alumno.confirmar_password = '';
    }
  }

 /*  public actualizar(): void {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.alumnosService.editarAlumno(this.alumno).subscribe({
      next: () => {
        this.notificationService.success('Alumno actualizado exitosamente');
        this.router.navigate(['/app/alumnos']);
      },
      error: () => {
        this.notificationService.error('Error al actualizar alumno');
      }
    });
  } */
  public actualizar(): void {
      this.errors = {};
      this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

      if (Object.keys(this.errors).length > 0) {
        return;
      }

      const dialogRef = this.dialog.open(EditarUserModal, {
        data: {
          id: this.alumno,
          rol: 'alumno'
        },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.isEdit) {
          this.alumnosService.editarAlumno(this.alumno).subscribe({
            next: () => {
              this.notificationService.success('Alumno actualizado exitosamente');
              this.router.navigate(['/app/alumnos']);
            },
            error: () => {
              this.notificationService.error('Error al actualizar alumno');
            }
          });
        }
      });
    }


  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public changeFecha(event: any): void {
    this.alumno.fecha_nacimiento = event.value.toISOString().split('T')[0];
  }

  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

}
